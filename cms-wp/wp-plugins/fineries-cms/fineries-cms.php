<?php
/**
 * Plugin Name: Fineries CMS
 * Description: Headless content model for the Fineries Digital site — custom post types (Services, Work), ACF field groups, options pages, and a clean REST endpoint for the Astro front-end.
 * Version: 1.0.0
 * Author: Fineries
 * Requires Plugins: advanced-custom-fields-pro
 */

if (!defined('ABSPATH')) exit;

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
  acf_add_options_page(['page_title' => 'Site Settings', 'menu_title' => 'Site Settings', 'menu_slug' => 'fineries-settings', 'icon_url' => 'dashicons-admin-settings', 'position' => 3]);
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
      // Featured Work
      $txt('work_eyebrow', 'Work — eyebrow'),
      $txt('work_heading', 'Work — heading'),
      // The Fineries Method
      $txt('method_eyebrow', 'Method — eyebrow'),
      $area('method_body', 'Method — body'),
      $txt('method_tagline', 'Method — tagline'),
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
      $txt('cta_heading', 'CTA — heading'),
      $area('cta_body', 'CTA — body'),
    ],
  ]);

  // ---- SITE SETTINGS (options) ----
  acf_add_local_field_group([
    'key' => 'group_settings',
    'title' => 'Site Settings',
    'show_in_rest' => 1,
    'location' => [[['param' => 'options_page', 'operator' => '==', 'value' => 'fineries-settings']]],
    'fields' => [
      $txt('footer_tagline', 'Footer tagline'),
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
      $area('description', 'Description'),
      $txt('link', 'Link'),
      ['key' => 'f_svc_color', 'name' => 'color', 'label' => 'Panel colour', 'type' => 'select', 'choices' => ['blue' => 'Blue', 'gold' => 'Gold', 'magenta' => 'Magenta', 'teal' => 'Teal'], 'default_value' => 'blue'],
      $img('image', 'Card image'),
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
      // hero_words: comma string → array
      if (!empty($home['hero_words']) && is_string($home['hero_words'])) {
        $home['hero_words'] = array_values(array_filter(array_map('trim', explode(',', $home['hero_words']))));
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
