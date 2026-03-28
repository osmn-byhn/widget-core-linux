import { DesktopWidget } from "./index.js";
async function main() {
    console.log("🌟 Creating a widget from HTML SOURCE...");
    DesktopWidget.killAllProcesses();
    const html = `
        <style>
            body { 
                margin: 0; 
                padding: 100px 20px; 
                font-family: 'Inter', system-ui, sans-serif; 
                color: white; 
                height: 2000px; /* Long content */
                background: transparent;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .content { font-size: 24px; text-align: center; }
        </style>
        <div class="content">
            <h1>Scroll Test</h1>
            <p>This content is 2000px tall.</p>
            <p>Scrollbar should be HIDDEN.</p>
            <p>If scroll: false, you should NOT be able to scroll.</p>
            <div style="margin-top: 1500px;">YOU REACHED THE BOTTOM (if scrolling is on)</div>
        </div>
    `;
    /*const options: WidgetOptions = {
        width: 600,
        height: 400,
        x: 200,
        y: 200,
        opacity: 0.98,
        sticky: true,
        blur: true,
        interactive: true,
        html: html,
        scroll: true // Disable scrolling
    };

    // No URL needed when html is provided
    const widget = new DesktopWidget("", options);

    console.log(`🚀 HTML Widget created with ID: ${widget.id}`);
    await widget.makePersistent(options);

    console.log("📡 Launching standalone...");
    widget.launchStandalone();

    console.log("\n✅ Done! HTML Widget is now running.");
    console.log("Bu widget doğrudan kaynak kodundan (string) yüklenmiştir.");*/
}
main().catch(console.error);
//# sourceMappingURL=test.js.map