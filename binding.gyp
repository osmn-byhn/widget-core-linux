{
  "targets": [
    {
      "target_name": "widget_shield_native",
      "sources": [ 
        "native/main.cpp",
        "native/linux/WidgetManager.cpp"
      ],
      "include_dirs": [
        "native",
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "dependencies": ["<!(node -p \"require('node-addon-api').gyp\")"],
      "cflags": [ 
        "<!@(pkg-config --cflags gtk+-3.0 webkit2gtk-4.1 gtk-layer-shell-0 2>/dev/null || pkg-config --cflags gtk+-3.0 webkit2gtk-4.0 2>/dev/null)" 
      ],
      "cflags_cc": [ 
        "<!@(pkg-config --cflags gtk+-3.0 webkit2gtk-4.1 gtk-layer-shell-0 2>/dev/null || pkg-config --cflags gtk+-3.0 webkit2gtk-4.0 2>/dev/null)" 
      ],
      "defines": [ 
        "HAVE_GTK_LAYER_SHELL",
        "NAPI_DISABLE_CPP_EXCEPTIONS" 
      ],
      "link_settings": {
        "libraries": [ 
          "<!@(pkg-config --libs gtk+-3.0 webkit2gtk-4.1 gtk-layer-shell-0 2>/dev/null || pkg-config --libs gtk+-3.0 webkit2gtk-4.0 2>/dev/null)",
          "-lX11"
        ]
      }
    }
  ]
}

