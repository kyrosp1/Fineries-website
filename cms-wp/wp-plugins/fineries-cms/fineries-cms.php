<?php
/**
 * Plugin Name: Fineries CMS
 * Description: Headless content model for the Fineries Digital site — custom post types (Services, Work), ACF field groups, options pages, and a clean REST endpoint for the Astro front-end.
 * Version: 1.20.0
 * Author: Fineries
 * Requires Plugins: advanced-custom-fields-pro
 */

if (!defined('ABSPATH')) exit;

/* =========================================================
   0) HEADLESS LOCKDOWN
   This WordPress is a headless CMS only — nobody should browse it.
   Front-end page views are redirected to the public site; the REST API,
   wp-admin, login, AJAX/cron and media files keep working normally.
   Set FINERIES_PUBLIC_URL in wp-config.php to change the destination.
   ========================================================= */
if (!defined('FINERIES_PUBLIC_URL')) define('FINERIES_PUBLIC_URL', 'https://fineries.net');

add_action('template_redirect', function () {
  // Never touch API calls, the admin, AJAX or cron.
  if ((defined('REST_REQUEST') && REST_REQUEST) || is_admin() || wp_doing_ajax() || (defined('DOING_CRON') && DOING_CRON)) return;
  // Let logged-in editors/admins still preview the raw WP if they want to.
  if (is_user_logged_in()) return;
  wp_redirect(FINERIES_PUBLIC_URL, 302);
  exit;
}, 0);

// Ask search engines not to index the CMS domain.
add_action('send_headers', function () {
  if (!is_admin()) header('X-Robots-Tag: noindex, nofollow', true);
});

/* =========================================================
   1) CUSTOM POST TYPES  (repeatable cards)
   ========================================================= */
add_action('init', function () {
  register_post_type('service', [
    'label' => 'Services',
    'public' => true,
    'show_in_rest' => true,
    'menu_icon' => 'dashicons-screenoptions',
    'supports' => ['title', 'page-attributes'], // page-attributes = menu_order for sorting
    'has_archive' => false,
  ]);
  register_post_type('work', [
    'label' => 'Work',
    'public' => true,
    'show_in_rest' => true,
    'menu_icon' => 'dashicons-portfolio',
    'supports' => ['title', 'page-attributes'],
    'has_archive' => false,
  ]);
  // Contact-form submissions (private: admin-only, never public / not in public REST).
  register_post_type('enquiry', [
    'label' => 'Enquiries',
    'labels' => ['name' => 'Enquiries', 'singular_name' => 'Enquiry', 'menu_name' => 'Enquiries'],
    'public' => false,
    'show_ui' => true,
    'show_in_menu' => true,
    'show_in_rest' => false,
    'menu_icon' => 'dashicons-email-alt',
    'supports' => ['title'],
    'capabilities' => ['create_posts' => 'do_not_allow'], // created only via the form endpoint
    'map_meta_cap' => true,
    'has_archive' => false,
  ]);
});

// Admin list columns for Enquiries (email + submitted date at a glance).
add_filter('manage_enquiry_posts_columns', function ($cols) {
  return ['cb' => $cols['cb'] ?? '', 'title' => 'Name', 'enq_email' => 'Email', 'enq_company' => 'Company', 'date' => 'Received'];
});
add_action('manage_enquiry_posts_custom_column', function ($col, $post_id) {
  if ($col === 'enq_email') echo esc_html(get_post_meta($post_id, 'email', true));
  if ($col === 'enq_company') echo esc_html(get_post_meta($post_id, 'company', true));
}, 10, 2);

// Details panel on the Enquiry edit screen (the CPT only supports a title, so show the
// submitted fields here).
add_action('add_meta_boxes', function () {
  add_meta_box('fnr_enquiry_details', 'Enquiry details', function ($post) {
    $rows = [
      'name' => 'Name', 'email' => 'Email', 'company' => 'Company', 'services' => 'Services',
      'budget' => 'Budget', 'timeline' => 'Timeline', 'challenge' => 'Message',
      'submitted_at' => 'Submitted', 'source_ip' => 'IP address',
    ];
    echo '<table class="widefat striped" style="margin-top:6px"><tbody>';
    foreach ($rows as $k => $label) {
      $v = get_post_meta($post->ID, $k, true);
      $cell = $k === 'challenge' ? nl2br(esc_html($v)) : esc_html($v);
      if ($k === 'email' && $v) $cell = '<a href="mailto:' . esc_attr($v) . '">' . esc_html($v) . '</a>';
      echo '<tr><th style="width:150px;text-align:left;vertical-align:top">' . esc_html($label) . '</th><td>' . ($cell ?: '—') . '</td></tr>';
    }
    echo '</tbody></table>';
    $email = get_post_meta($post->ID, 'email', true);
    if ($email) echo '<p style="margin-top:12px"><a class="button button-primary" href="mailto:' . esc_attr($email) . '">Reply by email</a></p>';
  }, 'enquiry', 'normal', 'high');
});

/* =========================================================
   2) ACF OPTIONS PAGES  (singletons: Home + Site Settings)
   ========================================================= */
add_action('acf/init', function () {
  if (!function_exists('acf_add_options_page')) return;
  acf_add_options_page(['page_title' => 'Home Content', 'menu_title' => 'Home Content', 'menu_slug' => 'fineries-home', 'icon_url' => 'dashicons-admin-home', 'position' => 2]);
  acf_add_options_page(['page_title' => 'What We Do Page', 'menu_title' => 'What We Do Page', 'menu_slug' => 'fineries-wwd', 'icon_url' => 'dashicons-screenoptions', 'position' => 3]);
  acf_add_options_page(['page_title' => 'Web & App Page', 'menu_title' => 'Web & App Page', 'menu_slug' => 'fineries-dpt', 'icon_url' => 'dashicons-desktop', 'position' => 3]);
  acf_add_options_page(['page_title' => 'Brand & Strategy Page', 'menu_title' => 'Brand & Strategy Page', 'menu_slug' => 'fineries-brand-strategy', 'icon_url' => 'dashicons-art', 'position' => 3]);
  acf_add_options_page(['page_title' => 'Marketing & Growth Page', 'menu_title' => 'Marketing & Growth Page', 'menu_slug' => 'fineries-marketing-growth', 'icon_url' => 'dashicons-megaphone', 'position' => 3]);
  acf_add_options_page(['page_title' => 'Content & Production Page', 'menu_title' => 'Content & Production Page', 'menu_slug' => 'fineries-content-production', 'icon_url' => 'dashicons-video-alt3', 'position' => 3]);
  acf_add_options_page(['page_title' => 'Executive Branding Page', 'menu_title' => 'Executive Branding Page', 'menu_slug' => 'fineries-executive-branding', 'icon_url' => 'dashicons-businessperson', 'position' => 3]);
  acf_add_options_page(['page_title' => 'About Page', 'menu_title' => 'About Page', 'menu_slug' => 'fineries-about', 'icon_url' => 'dashicons-groups', 'position' => 3]);
  acf_add_options_page(['page_title' => 'Contact Page', 'menu_title' => 'Contact Page', 'menu_slug' => 'fineries-contact', 'icon_url' => 'dashicons-email-alt', 'position' => 3]);
  acf_add_options_page(['page_title' => 'Site Settings', 'menu_title' => 'Site Settings', 'menu_slug' => 'fineries-settings', 'icon_url' => 'dashicons-admin-settings', 'position' => 4]);
});

/* =========================================================
   3) ACF FIELD GROUPS  (defined in code → nothing to click)
   ========================================================= */
add_action('acf/init', function () {
  if (!function_exists('acf_add_local_field_group')) return;

  $txt = fn($n, $l) => ['key' => "f_$n", 'name' => $n, 'label' => $l, 'type' => 'text'];
  $area = fn($n, $l) => ['key' => "f_$n", 'name' => $n, 'label' => $l, 'type' => 'textarea', 'rows' => 3];
  $wys = fn($n, $l) => ['key' => "f_$n", 'name' => $n, 'label' => $l, 'type' => 'wysiwyg', 'media_upload' => 0];
  $img = fn($n, $l) => ['key' => "f_$n", 'name' => $n, 'label' => $l, 'type' => 'image', 'return_format' => 'url', 'preview_size' => 'medium'];
  $file = fn($n, $l) => ['key' => "f_$n", 'name' => $n, 'label' => $l, 'type' => 'file', 'return_format' => 'url'];

  // ---- HOME (options) ----
  acf_add_local_field_group([
    'key' => 'group_home',
    'title' => 'Home Content',
    'show_in_rest' => 1,
    'location' => [[['param' => 'options_page', 'operator' => '==', 'value' => 'fineries-home']]],
    'fields' => [
      // Hero
      $txt('hero_words', 'Hero rotating words (comma-separated)'),
      ['key' => 'f_hero_bg_color', 'name' => 'hero_bg_color', 'label' => 'Hero background colour', 'type' => 'color_picker', 'default_value' => '#3C4099'],
      $img('hero_image', 'Hero couple image (PNG)'),
      $file('hero_video', 'Hero “Watch our story” video'),
      $txt('hero_lead_in', 'Hero — lead-in (before rotating word)'),
      $txt('hero_lead_out', 'Hero — lead-out (after rotating word)'),
      $txt('hero_watch_label', 'Hero — watch button label'),
      // What We Do
      $txt('wwd_eyebrow', 'WWD — eyebrow'),
      $txt('wwd_heading', 'WWD — heading'),
      $txt('wwd_heading_accent', 'WWD — heading accent'),
      $area('wwd_body', 'WWD — body'),
      $txt('wwd_cta_label', 'WWD — button label'),
      // The Truth
      $txt('truth_eyebrow', 'Truth — eyebrow'),
      $txt('truth_heading', 'Truth — heading'),
      $wys('truth_body', 'Truth — body'),
      $img('truth_image_1', 'Truth — image'),
      // Our Process
      $txt('process_eyebrow', 'Process — eyebrow'),
      $txt('process_heading', 'Process — heading'),
      $area('process_body', 'Process — body'),
      $txt('process_cta_label', 'Process — button label'),
      ['key' => 'f_process_steps', 'name' => 'process_steps', 'label' => 'Process steps', 'type' => 'repeater', 'layout' => 'block', 'sub_fields' => [
        $txt('num', 'Number'), $txt('icon', 'Icon (Lucide name)'), $txt('title', 'Title'), $area('description', 'Description'),
      ]],
      // Featured Work (legacy cards — kept for a future Work page)
      $txt('work_eyebrow', 'Work — eyebrow'),
      $txt('work_heading', 'Work — heading'),
      $txt('work_cta_label', 'Work — “view all” link label'),
      // Client logos marquee (add as many as you like)
      $txt('logos_eyebrow', 'Logos — eyebrow'),
      $txt('logos_heading', 'Logos — heading'),
      ['key' => 'f_logos', 'name' => 'logos', 'label' => 'Client logos (unlimited)', 'type' => 'repeater', 'layout' => 'block', 'button_label' => 'Add logo', 'sub_fields' => [
        $img('image', 'Logo image (SVG/PNG, ideally on transparent bg)'),
        $txt('name', 'Name (shown as text if no image)'),
        $txt('link', 'Link (optional)'),
      ]],
      // The Fineries Method
      $txt('method_eyebrow', 'Method — eyebrow'),
      $area('method_body', 'Method — body'),
      $txt('method_tagline', 'Method — tagline'),
      $txt('method_cta_label', 'Method — link label'),
      ['key' => 'f_method_circles', 'name' => 'method_circles', 'label' => 'Method circles', 'type' => 'repeater', 'layout' => 'block', 'sub_fields' => [
        $txt('title', 'Title'), $area('description', 'Description'),
      ]],
      // The Value
      $txt('bv_eyebrow', 'Value — eyebrow'),
      $txt('bv_heading', 'Value — heading'),
      $area('bv_intro', 'Value — intro'),
      ['key' => 'f_bv_items', 'name' => 'bv_items', 'label' => 'Value items', 'type' => 'repeater', 'layout' => 'block', 'sub_fields' => [
        $txt('title', 'Title'), $txt('icon', 'Icon (Lucide name)'), $area('description', 'Description'),
      ]],
      // Final CTA
      $txt('cta_eyebrow', 'CTA — eyebrow'),
      $txt('cta_lead_in', 'CTA — lead-in (before rotating word)'),
      $txt('cta_words', 'CTA — rotating words (comma-separated)'),
      $txt('cta_lead_out', 'CTA — lead-out (after rotating word)'),
      $area('cta_body', 'CTA — body'),
      $txt('cta_button_label', 'CTA — button label'),
      $img('cta_image', 'CTA — image (defaults to the hero image if empty)'),
    ],
  ]);

  // ---- WHAT WE DO PAGE (options) ----
  acf_add_local_field_group([
    'key' => 'group_wwd',
    'title' => 'What We Do Page',
    'show_in_rest' => 1,
    'location' => [[['param' => 'options_page', 'operator' => '==', 'value' => 'fineries-wwd']]],
    'fields' => [
      // Hero
      $txt('wwd_hero_eyebrow', 'Hero — eyebrow'),
      $txt('wwd_hero_heading', 'Hero — heading'),
      $wys('wwd_hero_body', 'Hero — body'),
      $img('wwd_hero_image', 'Hero — image (portrait; defaults to home hero image)'),
      $txt('wwd_hero_tags', 'Hero — image tags (comma-separated)'),
      $txt('wwd_hero_cta_label', 'Hero — button label'),
      // Intro
      $txt('wwd_intro_eyebrow', 'Intro — eyebrow'),
      $txt('wwd_intro_heading', 'Intro — heading'),
      $wys('wwd_intro_body', 'Intro — body'),
      // Capabilities
      $txt('wwd_caps_eyebrow', 'Capabilities — eyebrow'),
      $txt('wwd_caps_heading', 'Capabilities — heading'),
      $txt('wwd_caps_tagline', 'Capabilities — tagline (right of heading)'),
      // SEO
      $txt('wwd_seo_title', 'SEO — browser/tab title'),
      $area('wwd_seo_description', 'SEO — meta description'),
    ],
  ]);

  // ---- WEB & APP PAGE (Digital Products & Technology) ----
  acf_add_local_field_group([
    'key' => 'group_dpt',
    'title' => 'Web & App Page',
    'show_in_rest' => 1,
    'location' => [[['param' => 'options_page', 'operator' => '==', 'value' => 'fineries-dpt']]],
    'fields' => [
      // Hero
      $txt('dpt_hero_eyebrow', 'Hero — eyebrow'),
      $txt('dpt_hero_heading', 'Hero — heading'),
      $area('dpt_hero_body', 'Hero — body'),
      $txt('dpt_hero_cta_label', 'Hero — button label'),
      // The shift
      $txt('dpt_de_eyebrow', 'Shift — eyebrow'),
      $txt('dpt_de_heading', 'Shift — heading'),
      $wys('dpt_de_body', 'Shift — body'),
      $img('dpt_de_image', 'Shift — image'),
      // Where our solutions create value
      $txt('dpt_value_heading', 'Value — heading'),
      $area('dpt_value_intro', 'Value — intro'),
      ['key' => 'f_dpt_value_items', 'name' => 'dpt_value_items', 'label' => 'Value items', 'type' => 'repeater', 'layout' => 'block', 'sub_fields' => [
        $txt('icon', 'Icon (Lucide name)'), $txt('title', 'Title'), $area('description', 'Description'),
      ]],
      // What we build
      $txt('dpt_build_eyebrow', 'Build — eyebrow'),
      $txt('dpt_build_heading', 'Build — heading'),
      ['key' => 'f_dpt_build_items', 'name' => 'dpt_build_items', 'label' => 'What we build (blocks)', 'type' => 'repeater', 'layout' => 'block', 'sub_fields' => [
        $txt('icon', 'Icon (Lucide name)'), $txt('title', 'Title'), $area('description', 'Description'), $area('services', 'Services (one per line)'),
      ]],
      // SEO
      $txt('dpt_seo_title', 'SEO — browser/tab title'),
      $area('dpt_seo_description', 'SEO — meta description'),
    ],
  ]);

  // ---- BRAND & STRATEGY PAGE ----
  acf_add_local_field_group([
    'key' => 'group_brand_strategy',
    'title' => 'Brand & Strategy Page',
    'show_in_rest' => 1,
    'location' => [[['param' => 'options_page', 'operator' => '==', 'value' => 'fineries-brand-strategy']]],
    'fields' => [
      // Hero
      $txt('bs_hero_eyebrow', 'Hero — eyebrow'),
      $txt('bs_hero_heading', 'Hero — heading'),
      $wys('bs_hero_body', 'Hero — body'),
      $file('bs_hero_video_desktop', 'Hero — landscape video (desktop)'),
      $file('bs_hero_video_mobile', 'Hero — portrait video (mobile)'),
      $img('bs_hero_poster', 'Hero — video thumbnail'),
      // The problem
      $txt('bs_problem_eyebrow', 'Problem — eyebrow'),
      $txt('bs_problem_heading', 'Problem — heading'),
      $wys('bs_problem_body', 'Problem — body'),
      $area('bs_problem_questions', 'Problem — questions (one per line)'),
      // What we do
      $txt('bs_services_eyebrow', 'Services — eyebrow'),
      $txt('bs_services_heading', 'Services — heading'),
      // Subservice cards (incl. image/SVG upload) are edited on the SERVICE post itself
      // (Services → Brand & Strategy → Subservices), not here — see cap_subservices.
      // CTA
      $txt('bs_cta_heading', 'CTA — heading'),
      $txt('bs_cta_label', 'CTA — button label'),
      $txt('bs_cta_link', 'CTA — button link'),
      // SEO
      $txt('bs_seo_title', 'SEO — browser/tab title'),
      $area('bs_seo_description', 'SEO — meta description'),
    ],
  ]);

  // ---- REMAINING CAPABILITY PAGES ----
  $capability_page_group = function ($prefix, $title, $menu_slug) use ($txt, $area, $wys, $img, $file) {
    acf_add_local_field_group([
      'key' => "group_{$prefix}_page",
      'title' => "$title Page",
      'show_in_rest' => 1,
      'location' => [[['param' => 'options_page', 'operator' => '==', 'value' => $menu_slug]]],
      'fields' => [
        $txt("{$prefix}_hero_eyebrow", 'Hero — eyebrow'),
        $txt("{$prefix}_hero_heading", 'Hero — heading'),
        $wys("{$prefix}_hero_body", 'Hero — body'),
        $file("{$prefix}_hero_video_desktop", 'Hero — landscape video (desktop)'),
        $file("{$prefix}_hero_video_mobile", 'Hero — portrait video (mobile)'),
        $img("{$prefix}_hero_poster", 'Hero — video thumbnail'),
        $txt("{$prefix}_intro_eyebrow", 'Intro — eyebrow'),
        $txt("{$prefix}_intro_heading", 'Intro — heading'),
        $wys("{$prefix}_intro_body", 'Intro — body'),
        $txt("{$prefix}_services_eyebrow", 'Services — eyebrow'),
        $txt("{$prefix}_services_heading", 'Services — heading'),
        // Subservice cards (incl. image/SVG upload) are edited on the SERVICE post itself
        // (Services → [this service] → Subservices), not here — see cap_subservices.
        $txt("{$prefix}_principle_eyebrow", 'Principle — eyebrow'),
        $txt("{$prefix}_principle_heading", 'Principle — heading'),
        $wys("{$prefix}_principle_body", 'Principle — body'),
        ['key' => "f_{$prefix}_steps", 'name' => "{$prefix}_steps", 'label' => 'Process steps (optional)', 'type' => 'repeater', 'layout' => 'block', 'sub_fields' => [
          ['key' => "f_{$prefix}_step_title", 'name' => 'title', 'label' => 'Title', 'type' => 'text'],
          ['key' => "f_{$prefix}_step_description", 'name' => 'description', 'label' => 'Description', 'type' => 'textarea', 'rows' => 3],
        ]],
        $txt("{$prefix}_seo_title", 'SEO — browser/tab title'),
        $area("{$prefix}_seo_description", 'SEO — meta description'),
      ],
    ]);
  };
  $capability_page_group('mg', 'Marketing & Growth', 'fineries-marketing-growth');
  $capability_page_group('cp', 'Content & Production', 'fineries-content-production');
  $capability_page_group('epb', 'Executive & Personal Branding', 'fineries-executive-branding');

  // ---- ABOUT PAGE ----
  acf_add_local_field_group([
    'key' => 'group_about_page', 'title' => 'About Page', 'show_in_rest' => 1,
    'location' => [[['param' => 'options_page', 'operator' => '==', 'value' => 'fineries-about']]],
    'fields' => [
      $txt('about_hero_eyebrow','Hero — eyebrow'), $txt('about_hero_heading','Hero — heading'), $wys('about_hero_body','Hero — body'), $img('about_hero_image','Hero — team image'),
      $txt('about_belief_eyebrow','Belief — eyebrow'), $txt('about_belief_heading','Belief — heading'), $wys('about_belief_body','Belief — body'),
      $txt('about_disciplines_eyebrow','Disciplines — eyebrow'), $txt('about_disciplines_heading','Disciplines — heading'),
      ['key'=>'f_about_disciplines','name'=>'about_disciplines','label'=>'Disciplines','type'=>'repeater','layout'=>'block','sub_fields'=>[
        ['key'=>'f_about_disc_icon','name'=>'icon','label'=>'Icon (Lucide name)','type'=>'text'], ['key'=>'f_about_disc_title','name'=>'title','label'=>'Title','type'=>'text'], ['key'=>'f_about_disc_desc','name'=>'description','label'=>'Description','type'=>'textarea','rows'=>3],
      ]],
      $area('about_disciplines_closing','Disciplines — closing line'), $txt('about_team_eyebrow','Team — eyebrow'), $txt('about_team_heading','Team — heading'), $wys('about_team_body','Team — body'), $area('about_team_points','Team — points (one per line)'),
      $txt('about_lagos_eyebrow','Lagos — eyebrow'), $txt('about_lagos_heading','Lagos — heading'), $wys('about_lagos_body','Lagos — body'),
      $txt('about_seo_title','SEO — browser/tab title'), $area('about_seo_description','SEO — meta description'),
    ],
  ]);

  // ---- CONTACT PAGE ----
  acf_add_local_field_group([
    'key'=>'group_contact_page','title'=>'Contact Page','show_in_rest'=>1,
    'location'=>[[['param'=>'options_page','operator'=>'==','value'=>'fineries-contact']]],
    'fields'=>[
      $txt('contact_hero_eyebrow','Hero — eyebrow'), $txt('contact_hero_heading','Hero — heading'), $wys('contact_hero_body','Hero — body'),
      $txt('contact_form_eyebrow','Form — eyebrow'), $txt('contact_form_heading','Form — heading'), $txt('contact_submit_label','Form — submit label'),
      $txt('contact_details_eyebrow','Details — eyebrow'), $txt('contact_details_heading','Details — heading'),
      $txt('contact_seo_title','SEO — browser/tab title'), $area('contact_seo_description','SEO — meta description'),
    ],
  ]);

  // ---- SITE SETTINGS (options) ----
  acf_add_local_field_group([
    'key' => 'group_settings',
    'title' => 'Site Settings',
    'show_in_rest' => 1,
    'location' => [[['param' => 'options_page', 'operator' => '==', 'value' => 'fineries-settings']]],
    'fields' => [
      // SEO / browser tab
      $txt('seo_title', 'Browser tab / SEO title'),
      $area('seo_description', 'SEO meta description (shown in search results & link previews)'),
      // Navigation (used by both the desktop and mobile menus)
      ['key' => 'f_nav_items', 'name' => 'nav_items', 'label' => 'Navigation items', 'type' => 'repeater', 'layout' => 'table', 'sub_fields' => [
        $txt('label', 'Label'), $txt('link', 'Link'),
      ]],
      // Footer
      $txt('footer_tagline', 'Footer tagline'),
      $txt('footer_services_heading', 'Footer — services column heading'),
      $txt('footer_company_heading', 'Footer — company column heading'),
      ['key' => 'f_footer_company_links', 'name' => 'footer_company_links', 'label' => 'Footer — company links', 'type' => 'repeater', 'layout' => 'table', 'sub_fields' => [
        $txt('label', 'Label'), $txt('link', 'Link'),
      ]],
      $txt('footer_contact_heading', 'Footer — contact column heading'),
      $txt('footer_copyright', 'Footer — copyright (after the year)'),
      ['key' => 'f_legal_links', 'name' => 'legal_links', 'label' => 'Footer — legal links', 'type' => 'repeater', 'layout' => 'table', 'sub_fields' => [
        $txt('label', 'Label'), $txt('link', 'Link'),
      ]],
      // Contact + social
      $txt('contact_email', 'Contact email'),
      $txt('location', 'Location'),
      $area('address', 'Address'),
      $txt('social_linkedin', 'LinkedIn URL'),
      $txt('social_instagram', 'Instagram URL'),
      $txt('social_x', 'X URL'),
      $txt('cf_analytics_token', 'Cloudflare Analytics token (from dash.cloudflare.com → Web Analytics)'),
      // --- Contact enquiries & email (ZeptoMail). These are stripped from the public REST. ---
      $area('enquiry_notify_emails', 'Enquiry notification email(s) — one per line (who receives contact-form submissions)'),
      $txt('zeptomail_token', 'ZeptoMail Send Mail token (Zoho-enczapikey …) — keep secret'),
      $txt('zeptomail_from_email', 'ZeptoMail "from" address (must be a verified sender/domain in ZeptoMail, e.g. noreply@fineries.net)'),
      $txt('zeptomail_from_name', 'ZeptoMail "from" name (e.g. Fineries Website)'),
      $txt('zeptomail_api_domain', 'ZeptoMail API domain (default: api.zeptomail.com; EU accounts use api.zeptomail.eu)'),
      // --- Auto-reply to the person who submitted (optional) ---
      ['key' => 'f_enquiry_autoreply_enabled', 'name' => 'enquiry_autoreply_enabled', 'label' => 'Send an auto-reply to the person who submitted?', 'type' => 'true_false', 'ui' => 1, 'default_value' => 0],
      $txt('enquiry_autoreply_subject', 'Auto-reply — subject (you can use {name})'),
      $wys('enquiry_autoreply_body', 'Auto-reply — message (you can use {name})'),
    ],
  ]);

  // ---- SERVICE (per card) ----
  acf_add_local_field_group([
    'key' => 'group_service',
    'title' => 'Service Card',
    'show_in_rest' => 1,
    'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'service']]],
    'fields' => [
      $txt('num', 'Number (e.g. 01)'),
      $area('description', 'Description (short — home page card)'),
      $txt('link', 'Link'),
      ['key' => 'f_svc_color', 'name' => 'color', 'label' => 'Panel colour', 'type' => 'select', 'choices' => ['blue' => 'Blue', 'gold' => 'Gold', 'magenta' => 'Magenta', 'teal' => 'Teal'], 'default_value' => 'blue'],
      $img('image', 'Card image'),
      // What We Do page fields
      $txt('cap_tagline', 'WWD — tagline (bold line)'),
      $area('cap_overview', 'WWD — overview paragraph'),
      $area('cap_skills', 'WWD — skills (one per line)'),
      $txt('cap_explore', 'WWD — “explore” link label'),
      $txt('cap_icon', 'WWD — card icon (Lucide name, e.g. box, megaphone)'),
      // Subservices — shown as chips on What We Do and as cards (with description) on the service page
      ['key' => 'f_cap_subservices', 'name' => 'cap_subservices', 'label' => 'Subservices', 'type' => 'repeater', 'layout' => 'block', 'button_label' => 'Add subservice', 'sub_fields' => [
        ['key' => 'f_cap_sub_icon', 'name' => 'icon', 'label' => 'Icon (Lucide name)', 'type' => 'text'],
        ['key' => 'f_cap_sub_title', 'name' => 'title', 'label' => 'Title', 'type' => 'text'],
        ['key' => 'f_cap_sub_description', 'name' => 'description', 'label' => 'Short description (card)', 'type' => 'textarea', 'rows' => 2],
        ['key' => 'f_cap_sub_full', 'name' => 'full', 'label' => 'Full copy (shown in the pop-up)', 'type' => 'textarea', 'rows' => 5],
        ['key' => 'f_cap_sub_image', 'name' => 'image', 'label' => 'Image / SVG (card artwork)', 'type' => 'image', 'return_format' => 'url', 'preview_size' => 'medium'],
      ]],
    ],
  ]);

  // ---- WORK (per card) ----
  acf_add_local_field_group([
    'key' => 'group_work',
    'title' => 'Work Card',
    'show_in_rest' => 1,
    'location' => [[['param' => 'post_type', 'operator' => '==', 'value' => 'work']]],
    'fields' => [
      $txt('category', 'Category'),
      $area('description', 'Description'),
      $img('image', 'Card image'),
    ],
  ]);
});

/* =========================================================
   3b) Allow SVG uploads (brand/subservice artwork), lightly sanitised.
   ========================================================= */
add_filter('upload_mimes', function ($mimes) {
  $mimes['svg'] = 'image/svg+xml';
  $mimes['svgz'] = 'image/svg+xml';
  return $mimes;
});
add_filter('wp_check_filetype_and_ext', function ($data, $file, $filename, $mimes) {
  if (strtolower(substr($filename, -4)) === '.svg') {
    $data['ext'] = 'svg';
    $data['type'] = 'image/svg+xml';
  }
  return $data;
}, 10, 4);
add_filter('wp_handle_upload_prefilter', function ($file) {
  if (($file['type'] ?? '') === 'image/svg+xml' && !empty($file['tmp_name']) && is_readable($file['tmp_name'])) {
    $svg = file_get_contents($file['tmp_name']);
    if ($svg !== false && $svg !== '') {
      $svg = preg_replace('#<script[\s\S]*?</script>#i', '', $svg);
      $svg = preg_replace('#<foreignObject[\s\S]*?</foreignObject>#i', '', $svg);
      $svg = preg_replace('#\son\w+\s*=\s*("[^"]*"|\'[^\']*\')#i', '', $svg);
      $svg = preg_replace('#(href|xlink:href)\s*=\s*("|\')\s*(javascript:|data:text/html)[^"\']*\2#i', '', $svg);
      file_put_contents($file['tmp_name'], $svg);
    }
  }
  return $file;
});

/* =========================================================
   4) REST: one tidy endpoint the Astro site reads
   GET /wp-json/fineries/v1/home
   ========================================================= */
add_action('rest_api_init', function () {
  register_rest_route('fineries/v1', '/home', [
    'methods' => 'GET',
    'permission_callback' => '__return_true',
    'callback' => function () {
      if (!function_exists('get_field')) return new WP_Error('acf_missing', 'ACF not active', ['status' => 500]);

      $home = get_fields('option') ?: [];
      // never expose server-only / secret settings to the public front-end
      foreach (['zeptomail_token', 'zeptomail_from_email', 'zeptomail_from_name', 'zeptomail_api_domain', 'enquiry_notify_emails', 'enquiry_autoreply_enabled', 'enquiry_autoreply_subject', 'enquiry_autoreply_body'] as $secret) {
        unset($home[$secret]);
      }
      // comma strings → arrays (hero + CTA rotating words)
      foreach (['hero_words', 'cta_words'] as $wf) {
        if (!empty($home[$wf]) && is_string($home[$wf])) {
          $home[$wf] = array_values(array_filter(array_map('trim', explode(',', $home[$wf]))));
        }
      }

      $services = array_map(function ($p) {
        return [
          'id' => $p->ID,
          'title' => get_the_title($p),
          'num' => get_field('num', $p->ID),
          'description' => get_field('description', $p->ID),
          'link' => get_field('link', $p->ID),
          'color' => get_field('color', $p->ID),
          'image' => get_field('image', $p->ID),
          'cap_tagline' => get_field('cap_tagline', $p->ID),
          'cap_overview' => get_field('cap_overview', $p->ID),
          'cap_skills' => get_field('cap_skills', $p->ID),
          'cap_explore' => get_field('cap_explore', $p->ID),
          'cap_icon' => get_field('cap_icon', $p->ID),
          'cap_subservices' => get_field('cap_subservices', $p->ID),
        ];
      }, get_posts(['post_type' => 'service', 'numberposts' => -1, 'orderby' => 'menu_order', 'order' => 'ASC']));

      $work = array_map(function ($p) {
        return [
          'id' => $p->ID,
          'client' => get_the_title($p),
          'category' => get_field('category', $p->ID),
          'description' => get_field('description', $p->ID),
          'image' => get_field('image', $p->ID),
        ];
      }, get_posts(['post_type' => 'work', 'numberposts' => -1, 'orderby' => 'menu_order', 'order' => 'ASC']));

      return [
        'home' => $home,
        'settings' => $home, // settings options live in the same option store
        'services' => $services,
        'work' => $work,
      ];
    },
  ]);

  // ---- Contact form: store submission + notify via ZeptoMail ----
  register_rest_route('fineries/v1', '/enquiry', [
    'methods' => 'POST',
    'permission_callback' => '__return_true',
    'callback' => 'fineries_handle_enquiry',
  ]);
});

function fineries_handle_enquiry(WP_REST_Request $req) {
  $p = $req->get_json_params();
  if (!is_array($p)) $p = $req->get_params();

  // Honeypot: real users leave this empty; bots fill it. Pretend success, store nothing.
  if (!empty($p['company_url'])) return ['ok' => true];

  $name      = sanitize_text_field($p['name'] ?? '');
  $email     = sanitize_email($p['email'] ?? '');
  $company   = sanitize_text_field($p['company'] ?? '');
  $budget    = sanitize_text_field($p['budget'] ?? '');
  $timeline  = sanitize_text_field($p['timeline'] ?? '');
  $challenge = sanitize_textarea_field($p['challenge'] ?? '');
  $services  = $p['service'] ?? ($p['services'] ?? []);
  if (is_string($services)) $services = array_filter(array_map('trim', explode(',', $services)));
  $services  = array_map('sanitize_text_field', (array) $services);

  if (!is_email($email)) {
    return new WP_Error('invalid', 'Please provide a valid email address.', ['status' => 422]);
  }
  // All fields are required.
  if ($name === '' || $company === '' || $budget === '' || $timeline === '' || $challenge === '' || empty($services)) {
    return new WP_Error('invalid', 'Please fill in all fields.', ['status' => 422]);
  }
  // Reject disposable / temporary email addresses.
  if (fineries_is_disposable_email($email)) {
    return new WP_Error('disposable', 'Please use a permanent email address (disposable addresses aren\'t accepted).', ['status' => 422]);
  }

  // Simple per-IP rate limit (max 5 / 10 min) to blunt spam.
  $ip = $_SERVER['REMOTE_ADDR'] ?? '';
  if ($ip) {
    $key = 'fnr_enq_' . md5($ip);
    $n = (int) get_transient($key);
    if ($n >= 5) return new WP_Error('rate', 'Too many submissions. Please try again later.', ['status' => 429]);
    set_transient($key, $n + 1, 10 * MINUTE_IN_SECONDS);
  }

  $svc_list = $services ? implode(', ', $services) : '—';
  $lines = [
    'Name: ' . $name,
    'Email: ' . $email,
    'Company: ' . ($company ?: '—'),
    'Services: ' . $svc_list,
    'Budget: ' . ($budget ?: '—'),
    'Timeline: ' . ($timeline ?: '—'),
    '',
    $challenge,
  ];
  $body_text = implode("\n", $lines);

  // Store as an Enquiry post (admin-only CPT).
  $post_id = wp_insert_post([
    'post_type'   => 'enquiry',
    'post_status' => 'publish',
    'post_title'  => $name . ' — ' . ($company ?: $email),
    'post_content'=> $body_text,
  ], true);
  if (is_wp_error($post_id)) {
    return new WP_Error('store_failed', 'Could not save the enquiry.', ['status' => 500]);
  }
  foreach (compact('name', 'email', 'company', 'budget', 'timeline', 'challenge') as $k => $v) {
    update_post_meta($post_id, $k, $v);
  }
  update_post_meta($post_id, 'services', $svc_list);
  update_post_meta($post_id, 'submitted_at', current_time('mysql'));
  update_post_meta($post_id, 'source_ip', $ip);

  // Notify internal recipients + optional auto-reply to the submitter (via ZeptoMail).
  $sent = fineries_send_zeptomail($name, $email, $svc_list, $budget, $timeline, $challenge, $company, $body_text);
  fineries_send_autoreply($name, $email);

  return ['ok' => true, 'id' => $post_id, 'emailed' => $sent];
}

// Low-level ZeptoMail send used by both the internal notification and the auto-reply.
function fineries_zeptomail_creds() {
  if (!function_exists('get_field')) return null;
  $token = preg_replace('/^Zoho-enczapikey\s+/i', '', trim((string) get_field('zeptomail_token', 'option')));
  $from  = trim((string) get_field('zeptomail_from_email', 'option'));
  if ($token === '' || $from === '') return null;
  return [
    'token' => $token,
    'from' => $from,
    'from_name' => trim((string) get_field('zeptomail_from_name', 'option')) ?: 'Fineries Website',
    'domain' => trim((string) get_field('zeptomail_api_domain', 'option')) ?: 'api.zeptomail.com',
  ];
}
function fineries_zeptomail_post($to, $subject, $html, $text, $reply_to = null) {
  $c = fineries_zeptomail_creds();
  if (!$c || empty($to)) return false;
  $payload = [
    'from' => ['address' => $c['from'], 'name' => $c['from_name']],
    'to' => $to,
    'subject' => $subject,
    'htmlbody' => $html,
    'textbody' => $text,
  ];
  if ($reply_to) $payload['reply_to'] = [$reply_to];
  $res = wp_remote_post('https://' . $c['domain'] . '/v1.1/email', [
    'timeout' => 20,
    'headers' => [
      'Authorization' => 'Zoho-enczapikey ' . $c['token'],
      'Content-Type' => 'application/json',
      'Accept' => 'application/json',
    ],
    'body' => wp_json_encode($payload),
  ]);
  if (is_wp_error($res)) return false;
  $code = wp_remote_retrieve_response_code($res);
  return $code >= 200 && $code < 300;
}
function fineries_is_disposable_email($email) {
  static $set = null;
  $at = strrchr($email, '@');
  if ($at === false) return false;
  $domain = strtolower(substr($at, 1));
  if ($domain === '') return false;
  if ($set === null) {
    $set = [];
    $file = __DIR__ . '/disposable-domains.txt';
    if (is_readable($file)) {
      foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $d) {
        $d = trim(strtolower($d));
        if ($d !== '' && $d[0] !== '#') $set[$d] = true;
      }
    }
  }
  if (isset($set[$domain])) return true;
  // catch subdomains of a listed domain (e.g. inbox.mailinator.com)
  $parts = explode('.', $domain);
  while (count($parts) > 2) {
    array_shift($parts);
    if (isset($set[implode('.', $parts)])) return true;
  }
  return false;
}
function fineries_enquiry_recipients() {
  $raw = function_exists('get_field') ? (string) get_field('enquiry_notify_emails', 'option') : '';
  return array_values(array_filter(array_map('trim', preg_split('/[\r\n,]+/', $raw)), 'is_email'));
}

function fineries_send_zeptomail($name, $email, $svc_list, $budget, $timeline, $challenge, $company, $body_text) {
  $recipients = fineries_enquiry_recipients();
  if (empty($recipients)) return false;

  $safe = fn($s) => htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8');
  $html = '<h2 style="margin:0 0 12px">New enquiry from the Fineries website</h2>'
    . '<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">'
    . '<tr><td><strong>Name</strong></td><td>' . $safe($name) . '</td></tr>'
    . '<tr><td><strong>Email</strong></td><td>' . $safe($email) . '</td></tr>'
    . '<tr><td><strong>Company</strong></td><td>' . $safe($company ?: '—') . '</td></tr>'
    . '<tr><td><strong>Services</strong></td><td>' . $safe($svc_list) . '</td></tr>'
    . '<tr><td><strong>Budget</strong></td><td>' . $safe($budget ?: '—') . '</td></tr>'
    . '<tr><td><strong>Timeline</strong></td><td>' . $safe($timeline ?: '—') . '</td></tr>'
    . '</table>'
    . '<p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap;margin-top:14px"><strong>Message:</strong><br>' . nl2br($safe($challenge)) . '</p>';

  $to = array_map(fn($e) => ['email_address' => ['address' => $e]], $recipients);
  return fineries_zeptomail_post(
    $to,
    'New website enquiry — ' . $name . ($company ? ' (' . $company . ')' : ''),
    $html,
    $body_text,
    ['address' => $email, 'name' => $name] // reply goes straight to the enquirer
  );
}

// Optional auto-reply to the person who submitted (subject/body editable in Site Settings).
function fineries_send_autoreply($name, $email) {
  if (!function_exists('get_field')) return false;
  if (!get_field('enquiry_autoreply_enabled', 'option')) return false;
  if (!is_email($email)) return false;

  $subject = trim((string) get_field('enquiry_autoreply_subject', 'option')) ?: 'Thanks for reaching out to Fineries';
  $html = (string) get_field('enquiry_autoreply_body', 'option');
  if (trim($html) === '') {
    $html = '<p>Hi {name},</p><p>Thanks for reaching out to Fineries — we\'ve received your message and one of our team will get back to you shortly.</p><p>— The Fineries Team</p>';
  }

  // Personalisation: the form collects one full-name field, and we use it as supplied.
  // All name tokens resolve to the full name: [First Name], {first_name}, [name], {name}, etc.
  $name_tokens = ['[First Name]', '[First name]', '[first name]', '[FirstName]', '{first_name}', '{first name}', '{firstname}', '{FirstName}', '[Full Name]', '[Name]', '[name]', '{name}', '{full_name}', '{Name}'];
  $safe_full = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
  $subject = str_ireplace($name_tokens, $name, $subject);
  $html = str_ireplace($name_tokens, $safe_full, $html);
  $text = wp_strip_all_tags($html);

  // Replies to the auto-reply should reach a monitored inbox.
  $recipients = fineries_enquiry_recipients();
  $reply_to = !empty($recipients) ? ['address' => $recipients[0], 'name' => 'Fineries'] : null;

  $to = [['email_address' => ['address' => $email, 'name' => $name]]];
  return fineries_zeptomail_post($to, $subject, $html, $text, $reply_to);
}
