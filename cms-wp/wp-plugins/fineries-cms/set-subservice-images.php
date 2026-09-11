<?php
/* One-off: sideload the Brand & Strategy subservice tile JPGs into the media library
   and set them as each subservice's `image` (cap_subservices) on the service CPT.
   Run: wp eval-file .../fineries-cms/set-subservice-images.php
   Non-destructive: only sets a row's image when it is currently EMPTY. Safe to re-run. */
if (!function_exists('get_field')) { echo "ACF not active\n"; return; }
if (!function_exists('media_handle_sideload')) {
  require_once ABSPATH . 'wp-admin/includes/media.php';
  require_once ABSPATH . 'wp-admin/includes/file.php';
  require_once ABSPATH . 'wp-admin/includes/image.php';
}

$dir = __DIR__ . '/seed-assets/subservices';
$map = [
  'Research & Insights'        => '01_research_insights.jpg',
  'Brand Strategy'             => '02_brand_strategy.jpg',
  'Brand Positioning'          => '03_brand_positioning.jpg',
  'Brand Architecture'         => '04_brand_architecture.jpg',
  'Brand Identity Systems'     => '05_brand_identity_systems.jpg',
  'Naming'                     => '06_naming.jpg',
  'Brand Messaging'            => '07_brand_messaging.jpg',
  'Verbal Identity'            => '08_verbal_identity.jpg',
  'Brand Guidelines'           => '09_brand_guidelines.jpg',
];

function fnr_sideload_local($path, $title) {
  if (!file_exists($path)) return 0;
  $tmp = wp_tempnam($path);
  if (!$tmp) return 0;
  copy($path, $tmp);
  $file = ['name' => basename($path), 'tmp_name' => $tmp];
  $id = media_handle_sideload($file, 0, $title);
  if (is_wp_error($id)) { @unlink($tmp); return 0; }
  return (int) $id;
}

$posts = get_posts(['post_type' => 'service', 'numberposts' => -1, 'meta_query' => [['key' => 'num', 'value' => '01']]]);
if (empty($posts)) { echo "Brand & Strategy service (num 01) not found\n"; return; }
$p = $posts[0];
$rows = get_field('cap_subservices', $p->ID);
if (empty($rows)) { echo "no subservices on {$p->post_title}\n"; return; }

$set = 0;
foreach ($rows as $i => $row) {
  $t = isset($row['title']) ? trim($row['title']) : '';
  if (!empty($row['image'])) { echo "skip (image set): $t\n"; continue; }
  if (empty($map[$t])) { echo "skip (no file mapped): $t\n"; continue; }
  $att = fnr_sideload_local("$dir/{$map[$t]}", $t . ' — Fineries subservice');
  if ($att) { $rows[$i]['image'] = $att; $set++; echo "set image for: $t (attachment $att)\n"; }
  else { echo "FAILED sideload: $t\n"; }
}
if ($set) update_field('cap_subservices', $rows, $p->ID);
echo "done — set $set image(s) on {$p->post_title}\n";
