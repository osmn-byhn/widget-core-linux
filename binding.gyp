{
  "targets": [
    {
      "target_name": "widget_shield_native",
      "sources": [ "native/main.cpp" ],
      "include_dirs": [
        "native",
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "dependencies": ["<!(node -p \"require('node-addon-api').gyp\")"],
      "conditions": [
        ["OS=='mac'", {
          "sources": [ "native/macos/WidgetManager.mm" ],
          "link_settings": { "libraries": ["-framework AppKit", "-framework WebKit"] }
        }],
        ["OS=='win'", {
          "sources": [ "native/win32/WidgetManager.cpp" ],
          "libraries": ["dwmapi.lib", "user32.lib"]
        }],
        ["OS=='linux'", {
          "sources": [ "native/linux/WidgetManager.cpp" ],
          "cflags": [ "<!@(pkg-config --cflags gtk+-3.0 webkit2gtk-4.1 gtk-layer-shell-0 2>/dev/null || pkg-config --cflags gtk+-3.0 webkit2gtk-4.0 2>/dev/null)" ],
          "cflags_cc": [ "<!@(pkg-config --cflags gtk+-3.0 webkit2gtk-4.1 gtk-layer-shell-0 2>/dev/null || pkg-config --cflags gtk+-3.0 webkit2gtk-4.0 2>/dev/null)" ],
          "defines": [ "HAVE_GTK_LAYER_SHELL" ],
          "link_settings": {
            "libraries": [ 
                "<!@(pkg-config --libs gtk+-3.0 webkit2gtk-4.1 gtk-layer-shell-0 2>/dev/null || pkg-config --libs gtk+-3.0 webkit2gtk-4.0 2>/dev/null)",
                "-lX11"
            ]
          }
        }]
      ],
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ]
    }
  ]
}
