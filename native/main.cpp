#include <napi.h>
#include "WidgetManager.h"

Napi::Value CreateWidget(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 2 || !info[0].IsString() || !info[1].IsObject()) {
        Napi::TypeError::New(env, "String and Object expected").ThrowAsJavaScriptException();
        return env.Null();
    }

    std::string url = info[0].As<Napi::String>().Utf8Value();
    Napi::Object opts = info[1].As<Napi::Object>();

    WidgetOptions options;
    options.width = opts.Get("width").ToNumber().Int32Value();
    options.height = opts.Get("height").ToNumber().Int32Value();
    options.x = opts.Get("x").ToNumber().Int32Value();
    options.y = opts.Get("y").ToNumber().Int32Value();
    options.opacity = opts.Has("opacity") ? opts.Get("opacity").ToNumber().DoubleValue() : 1.0;
    options.blur = opts.Has("blur") ? opts.Get("blur").ToBoolean().Value() : false;
    options.sticky = opts.Has("sticky") ? opts.Get("sticky").ToBoolean().Value() : true;
    options.interactive = opts.Has("interactive") ? opts.Get("interactive").ToBoolean().Value() : true;
    options.html = opts.Has("html") ? opts.Get("html").ToString().Utf8Value() : "";
    options.scroll = opts.Has("scroll") ? opts.Get("scroll").ToBoolean().Value() : true;

    void* handle = WidgetManager::CreateWidget(url, options);
    return Napi::External<void>::New(env, handle);
}

Napi::Value UpdateOpacity(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    void* handle = info[0].As<Napi::External<void>>().Data();
    double opacity = info[1].As<Napi::Number>().DoubleValue();
    
    WidgetManager::UpdateOpacity(handle, opacity);
    return env.Undefined();
}

Napi::Value UpdatePosition(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    void* handle = info[0].As<Napi::External<void>>().Data();
    int x = info[1].As<Napi::Number>().Int32Value();
    int y = info[2].As<Napi::Number>().Int32Value();
    
    WidgetManager::UpdatePosition(handle, x, y);
    return env.Undefined();
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    exports.Set("createWidget", Napi::Function::New(env, CreateWidget));
    exports.Set("updateOpacity", Napi::Function::New(env, UpdateOpacity));
    exports.Set("updatePosition", Napi::Function::New(env, UpdatePosition));
    return exports;
}

NODE_API_MODULE(widget_shield_native, Init)
