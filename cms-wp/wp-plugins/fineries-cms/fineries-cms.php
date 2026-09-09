<?php
/**
 * Plugin Name: Fineries CMS
 * Description: Headless content model for the Fineries Digital site — custom post types (Services, Work), ACF field groups, options pages, and a clean REST endpoint for the Astro front-end.
 * Version: 1.12.0
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
      ['key' => 'f_bs_services', 'name' => 'bs_services', 'label' => 'Brand & strategy services', 'type' => 'repeater', 'layout' => 'block', 'sub_fields' => [
        $txt('icon', 'Icon (Lucide name)'), $txt('title', 'Title'), $area('description', 'Description'),
      ]],
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
        ['key' => "f_{$prefix}_services", 'name' => "{$prefix}_services", 'label' => 'Services', 'type' => 'repeater', 'layout' => 'block', 'sub_fields' => [
          ['key' => "f_{$prefix}_service_icon", 'name' => 'icon', 'label' => 'Icon (Lucide name)', 'type' => 'text'],
          ['key' => "f_{$prefix}_service_title", 'name' => 'title', 'label' => 'Title', 'type' => 'text'],
          ['key' => "f_{$prefix}_service_description", 'name' => 'description', 'label' => 'Description', 'type' => 'textarea', 'rows' => 3],
        ]],
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
});
