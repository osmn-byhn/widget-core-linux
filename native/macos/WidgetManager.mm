#include "WidgetManager.h"
#import <AppKit/AppKit.h>
#import <WebKit/WebKit.h>

struct MacOSWidgetContext {
    NSWindow* window;
    WKWebView* webview;
};

void* WidgetManager::CreateWidget(const std::string& url, const WidgetOptions& options) {
    NSRect frame = NSMakeRect(options.x, options.y, options.width, options.height);
    
    NSWindow* window = [[NSWindow alloc] initWithContentRect:frame
                                                   styleMask:NSWindowStyleMaskBorderless
                                                     backing:NSBackingStoreBuffered
                                                       defer:NO];
    
    [window setBackgroundColor:[NSColor clearColor]];
    [window setOpaque:NO];
    [window setHasShadow:NO];
    
    if (options.sticky) {
        [window setLevel:kCGDesktopWindowLevel - 1]; // Pin to desktop
        [window setCollectionBehavior:NSWindowCollectionBehaviorCanJoinAllSpaces | NSWindowCollectionBehaviorStationary];
    } else {
        [window setLevel:NSFloatingWindowLevel];
    }
    
    if (options.blur) {
        NSVisualEffectView* blurView = [[NSVisualEffectView alloc] initWithFrame:frame];
        [blurView setBlendingMode:NSVisualEffectBlendingModeBehindWindow];
        [blurView setMaterial:NSVisualEffectMaterialDark];
        [blurView setState:NSVisualEffectStateActive];
        [window setContentView:blurView];
    }
    
    WKWebViewConfiguration* config = [[WKWebViewConfiguration alloc] init];
    // Security Shield: Sandbox settings
    [[config preferences] setJavaScriptEnabled:YES];
    
    // Inject CSS to hide scrollbars and handle overflow
    std::string scroll_css = "var style = document.createElement('style');"
                             "style.innerHTML = '::-webkit-scrollbar { display: none !important; width: 0 !important; } ';";
    if (!options.scroll) {
        scroll_css += "style.innerHTML += 'body { overflow: hidden !important; }';";
    }
    scroll_css += "document.head.appendChild(style);";
    
    WKUserScript* script = [[WKUserScript alloc] initWithSource:[NSString stringWithUTF8String:scroll_css.c_str()]
                                                  injectionTime:WKUserScriptInjectionTimeAtDocumentEnd
                                               forMainFrameOnly:YES];
    [[config userContentController] addUserScript:script];
    
    WKWebView* webview = [[WKWebView alloc] initWithFrame:[[window contentView] bounds] configuration:config];
    [webview setNavigationDelegate:nil];
    [webview setValue:@(NO) forKey:@"drawsBackground"];
    
    [[window contentView] addSubview:webview];
    
    if (!options.html.empty()) {
        [webview loadHTMLString:[NSString stringWithUTF8String:options.html.c_str()] baseURL:nil];
    } else {
        NSURL* nsUrl = [NSURL URLWithString:[NSString stringWithUTF8String:url.c_str()]];
        [webview loadRequest:[NSURLRequest requestWithURL:nsUrl]];
    }
    
    [window makeKeyAndOrderFront:nil];
    
    MacOSWidgetContext* ctx = new MacOSWidgetContext();
    ctx->window = window;
    ctx->webview = webview;
    
    return ctx;
}

void WidgetManager::UpdateOpacity(void* handle, double opacity) {
    MacOSWidgetContext* ctx = (MacOSWidgetContext*)handle;
    [ctx->window setAlphaValue:opacity];
}

void WidgetManager::UpdatePosition(void* handle, int x, int y) {
    MacOSWidgetContext* ctx = (MacOSWidgetContext*)handle;
    NSRect frame = [ctx->window frame];
    frame.origin.x = x;
    frame.origin.y = y;
    [ctx->window setFrame:frame display:YES];
}
