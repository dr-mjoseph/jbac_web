def update_styles():
    with open('src/styles.css', 'r', encoding='utf-8') as f:
        content = f.read()

    old_media = """/* Desktop Header (>= 1024px) */
@media (min-width: 1024px) {
  header.top_panel_wrap,
  .top_panel_wrap,
  .top_panel_wrap_inner,
  .top_panel_middle,
  .menu_main_wrap,
  .menu_main_nav_area {
    display: block !important;
    visibility: visible !important;
    height: auto !important;
    opacity: 1 !important;
  }
  .header_mobile {
    display: none !important;
    visibility: hidden !important;
    height: 0 !important;
    overflow: hidden !important;
  }
}

/* Mobile Header (< 1024px) */
@media (max-width: 1023px) {
  header.top_panel_wrap,
  .top_panel_wrap,
  .top_panel_wrap_inner,
  .top_panel_middle,
  .menu_main_wrap,
  .menu_main_nav_area {
    display: none !important;
    visibility: hidden !important;
    height: 0 !important;
    overflow: hidden !important;
  }
  .header_mobile {
    display: block !important;
    visibility: visible !important;
  }
}"""

    new_media = """/* Desktop Header (>= 1024px) */
@media (min-width: 1024px) {
  header.top_panel_wrap,
  .top_panel_wrap,
  .top_panel_wrap_inner,
  .top_panel_middle,
  .menu_main_wrap,
  .top_panel_wrap .menu_main_nav_area {
    display: block !important;
    visibility: visible !important;
    height: auto !important;
    opacity: 1 !important;
  }
  .header_mobile {
    display: none !important;
    visibility: hidden !important;
    height: 0 !important;
    overflow: hidden !important;
  }
}

/* Mobile Header (< 1024px) */
@media (max-width: 1023px) {
  header.top_panel_wrap,
  .top_panel_wrap,
  .top_panel_wrap_inner,
  .top_panel_middle,
  .menu_main_wrap,
  .top_panel_wrap .menu_main_nav_area {
    display: none !important;
    visibility: hidden !important;
    height: 0 !important;
    overflow: hidden !important;
  }
  .header_mobile {
    display: block !important;
    visibility: visible !important;
    position: relative !important;
    width: 100% !important;
    background: #ffffff !important;
    z-index: 9999 !important;
  }
  .header_mobile .content_wrap {
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
    padding: 10px 18px !important;
    position: relative !important;
    background: #ffffff !important;
    border-bottom: 1px solid #e2e8f0 !important;
  }
  .header_mobile .menu_button {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 44px !important;
    height: 44px !important;
    font-size: 26px !important;
    cursor: pointer !important;
    color: #00548F !important;
    background-color: transparent !important;
    z-index: 10002 !important;
    position: static !important;
    margin: 0 !important;
    user-select: none !important;
    -webkit-tap-highlight-color: transparent !important;
  }
  .header_mobile .menu_button:before {
    content: "☰" !important;
    font-family: inherit !important;
    font-weight: bold !important;
  }
  .header_mobile .side_wrap {
    display: block !important;
    position: fixed !important;
    top: 0 !important;
    left: -330px !important;
    width: 310px !important;
    max-width: 86vw !important;
    height: 100vh !important;
    bottom: 0 !important;
    overflow-y: auto !important;
    z-index: 100005 !important;
    background: #00548F !important;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.45) !important;
    transition: left 0.3s ease-in-out !important;
    padding: 0 !important;
  }
  .header_mobile .side_wrap.open {
    left: 0 !important;
  }
  .header_mobile .side_wrap .close {
    display: block !important;
    position: absolute !important;
    top: 14px !important;
    right: 14px !important;
    color: #ffffff !important;
    font-size: 15px !important;
    font-weight: 700 !important;
    cursor: pointer !important;
    z-index: 100006 !important;
    background: rgba(0, 0, 0, 0.25) !important;
    padding: 6px 12px !important;
    border-radius: 6px !important;
    letter-spacing: 0.5px !important;
  }
  .header_mobile .side_wrap .close:hover {
    background: rgba(255, 0, 0, 0.5) !important;
  }
  .header_mobile .side_wrap .menu_main_nav_area {
    display: block !important;
    visibility: visible !important;
    height: auto !important;
    opacity: 1 !important;
    padding-top: 55px !important;
    padding-bottom: 30px !important;
  }
  .header_mobile .mask {
    display: none !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background: rgba(0, 0, 0, 0.6) !important;
    z-index: 100004 !important;
    cursor: pointer !important;
  }
  .header_mobile .mask.show {
    display: block !important;
  }
}"""

    if old_media in content:
        content = content.replace(old_media, new_media)
        print("Updated media queries in src/styles.css")
    else:
        print("Warning: old_media not found directly")

    with open('src/styles.css', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    update_styles()

