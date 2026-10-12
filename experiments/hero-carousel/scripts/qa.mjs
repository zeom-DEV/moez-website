import { chromium } from "playwright"
import { spawn } from "node:child_process"
import { mkdirSync } from "node:fs"

mkdirSync("reports", { recursive: true })
const server = spawn("npm", ["run", "preview", "--", "--host", "127.0.0.1", "--port", "4173"], {
  stdio: ["ignore", "pipe", "pipe"],
  env: process.env,
  detached: true,
})
server.stdout.on("data", chunk => process.stdout.write(chunk))
server.stderr.on("data", chunk => process.stderr.write(chunk))

let browser
const failures = []
const assert = (condition, label) => {
  if (condition) console.log("PASS " + label)
  else { console.error("FAIL " + label); failures.push(label) }
}

async function waitForServer() {
  for (let k = 0; k < 55; k++) {
    try {
      const response = await fetch("http://127.0.0.1:4173/")
      if (response.ok) return
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 360))
  }
  throw new Error("Vite preview server did not become ready")
}

try {
  await waitForServer()
  browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] })

  for (const [name, dimensions] of [
    ["desktop", { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }],
    ["mobile", { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true }],
    ["small-mobile", { viewport: { width: 360, height: 740 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true }],
  ]) {
    const context = await browser.newContext(dimensions)
    const page = await context.newPage()
    const errors = []
    page.on("pageerror", err => errors.push(String(err)))
    page.on("console", msg => { if (msg.type() === "error") errors.push(msg.text()) })
    const response = await page.goto("http://127.0.0.1:4173/", { waitUntil: "domcontentloaded" })
    await page.locator(".orbit-hero__card").first().waitFor({ state: "visible" })
    await page.waitForTimeout(900)

    assert(response?.status() === 200, name + " document 200")
    assert(await page.locator(".orbit-hero__card").count() === 6, name + " exactly 6 real cards")
    assert(await page.locator(".signature-preview__chapters button").count() === 6, name + " six direct navigation chapters")
    assert(await page.locator(".orbit-hero__narrative h2").isVisible(), name + " cinematic heading visible")

    const initialTransform = await page.locator(".orbit-hero__card").first().evaluate(el => el.style.transform)
    await page.waitForTimeout(1100)
    const nextTransform = await page.locator(".orbit-hero__card").first().evaluate(el => el.style.transform)
    assert(initialTransform !== nextTransform, name + " physical automatic 3D motion advances")
    const frameStats = await page.evaluate(async () => new Promise(resolve => {
      const intervals = []
      let last = 0
      let start = 0
      const sample = (t) => {
        if (!start) start = t
        if (last) intervals.push(t - last)
        last = t
        if (t - start < 1400) requestAnimationFrame(sample)
        else {
          intervals.sort((a, b) => a - b)
          const average = intervals.reduce((a,b) => a + b, 0) / Math.max(1, intervals.length)
          resolve({ fps: Math.round(1000 / average), frameP95ms: Number((intervals[Math.floor(intervals.length * .95)] || 0).toFixed(1)), frames: intervals.length })
        }
      }
      requestAnimationFrame(sample)
    }))
    console.log("FRAME_METRICS " + name + " " + JSON.stringify(frameStats))
    try {
      await page.screenshot({ path: "reports/orbit-" + name + ".png", fullPage: true, animations: "allow", timeout: 14000 })
    } catch (error) {
      console.warn("SCREENSHOT warning " + name + " " + String(error))
    }

    // Automatic motion may have advanced any number of services by now.
    // Pause, choose a deterministic starting service, then test NEXT.
    await page.locator(".signature-preview__pause").click()
    await page.locator(".signature-preview__chapters button").first().click()
    await page.waitForTimeout(240)
    const next = page.getByRole("button", { name: "Service suivant" })
    await next.click()
    await page.waitForTimeout(640)
    assert((await page.locator(".signature-preview__focus-copy h1").innerText()).includes("Service client"), name + " next chapter updates details")
    assert((await page.locator(".orbit-hero__narrative h2").innerText()).trim().length > 10, name + " visible hero title never disappears")
    const nav = page.locator(".signature-preview__chapters button")
    await nav.nth(5).click()
    await page.waitForTimeout(680)
    assert((await page.locator(".signature-preview__focus-copy h1").innerText()).includes("Automatisation"), name + " direct chapter navigation")
    assert(errors.length === 0, name + " no runtime browser errors " + errors.join(" | "))
    const visuals = await page.locator(".orbit-hero__card-image").evaluateAll(imgs => imgs.map(img => ({ complete: img.complete, width: img.naturalWidth, src: img.src })))
    const missing = visuals.filter(img => img.complete && img.width === 0)
    console.log("PHOTOS " + name + " loaded=" + visuals.filter(img => img.width > 0).length + " missing=" + missing.length + " " + missing.map(img => img.src).join(" "))
    await context.close()
  }

  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" })
  const page = await context.newPage()
  await page.goto("http://127.0.0.1:4173/", { waitUntil: "domcontentloaded" })
  await page.locator(".orbit-hero__card").first().waitFor({ state: "visible" })
  const reducedBefore = await page.locator(".orbit-hero__card").first().evaluate(el => el.style.transform)
  await page.waitForTimeout(700)
  const reducedAfter = await page.locator(".orbit-hero__card").first().evaluate(el => el.style.transform)
  assert(reducedBefore === reducedAfter, "prefers-reduced-motion pauses auto orbit")
  await context.close()
} catch (error) {
  failures.push("QA runner: " + String(error))
  console.error(error)
} finally {
  await browser?.close()
  try { process.kill(-server.pid, "SIGTERM") } catch { server.kill("SIGTERM") }
  server.stdout.destroy()
  server.stderr.destroy()
}
if (failures.length) {
  console.error("FAILED " + failures.join("\n"))
  process.exit(1)
}
console.log("All orbit interaction checks passed")
process.exit(0)
