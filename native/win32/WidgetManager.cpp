#include "WidgetManager.h"
#include <windows.h>
#include <dwmapi.h>

// Note: In a real project, you'd integrate WebView2 SDK here.
// For now, this is the window management part.

struct Win32WidgetContext {
    HWND hwnd;
};

void* WidgetManager::CreateWidget(const std::string& url, const WidgetOptions& options) {
    HINSTANCE hInstance = GetModuleHandle(NULL);
    
    WNDCLASS wc = {0};
    wc.lpfnWndProc = DefWindowProc;
    wc.hInstance = hInstance;
    wc.lpszClassName = "WidgetWindowClass";
    RegisterClass(&wc);
    
    HWND hwnd = CreateWindowEx(
        WS_EX_LAYERED | WS_EX_TOOLWINDOW | ((options.sticky && !options.interactive) ? WS_EX_TRANSPARENT : 0),
        "WidgetWindowClass", "Widget",
        WS_POPUP | WS_VISIBLE,
        options.x, options.y, options.width, options.height,
        NULL, NULL, hInstance, NULL
    );
    
    SetLayeredWindowAttributes(hwnd, 0, (BYTE)(options.opacity * 255), LWA_ALPHA);
    
    if (options.blur) {
        DWM_BLURBEHIND bb = {0};
        bb.dwFlags = DWM_BB_ENABLE;
        bb.fEnable = TRUE;
        bb.hRgnBlur = NULL;
        DwmEnableBlurBehindWindow(hwnd, &bb);
    }
    
    if (options.sticky) {
        SetWindowPos(hwnd, HWND_BOTTOM, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE);
    }

    Win32WidgetContext* ctx = new Win32WidgetContext();
    ctx->hwnd = hwnd;
    
    return ctx;
}

void WidgetManager::UpdateOpacity(void* handle, double opacity) {
    Win32WidgetContext* ctx = (Win32WidgetContext*)handle;
    SetLayeredWindowAttributes(ctx->hwnd, 0, (BYTE)(opacity * 255), LWA_ALPHA);
}

void WidgetManager::UpdatePosition(void* handle, int x, int y) {
    Win32WidgetContext* ctx = (Win32WidgetContext*)handle;
    SetWindowPos(ctx->hwnd, NULL, x, y, 0, 0, SWP_NOSIZE | SWP_NOZORDER);
}
