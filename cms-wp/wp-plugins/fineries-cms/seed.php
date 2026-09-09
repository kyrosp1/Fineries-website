<?php
/* Seed the Fineries content into WordPress (ACF options + Services/Work CPTs).
   Run via: wp eval-file .../fineries-cms/seed.php  (idempotent-ish: skips if services exist) */

if (!function_exists('media_sideload_image')) {
  require_once ABSPATH . 'wp-admin/includes/media.php';
  require_once ABSPATH . 'wp-admin/includes/file.php';
  require_once ABSPATH . 'wp-admin/includes/image.php';
}

$SEED_DIR = __DIR__ . '/seed-assets';

function fnr_remote($url, $title) {
  $tmp = download_url($url);
  if (is_wp_error($tmp)) return 0;
  // force a .jpg name — Unsplash URLs have no extension, which WP rejects
  $file = ['name' => sanitize_title($title) . '.jpg', 'tmp_name' => $tmp];
  $id = media_handle_sideload($file, 0, $title);
  if (is_wp_error($id)) { @unlink($tmp); return 0; }
  return (int) $id;
}
function fnr_local($path, $title) {
  if (!file_exists($path)) return 0;
  $tmp = wp_tempnam($path);
  copy($path, $tmp);
  $file = ['name' => basename($path), 'tmp_name' => $tmp];
  $id = media_handle_sideload($file, 0, $title);
  return is_wp_error($id) ? 0 : (int) $id;
}

// ---- media ----
$hero_img  = fnr_local("$SEED_DIR/hero-couple.png", 'Hero couple');
$hero_vid  = fnr_local("$SEED_DIR/fineries-story.mp4", 'Fineries story video');
$truth_img = fnr_remote('https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=1200&q=80', 'Truth image');

// ---- Home options ----
update_field('hero_words', 'brands, products, content', 'option');
update_field('hero_bg_color', '#3C4099', 'option');
if ($hero_img) update_field('hero_image', $hero_img, 'option');
if ($hero_vid) update_field('hero_video', $hero_vid, 'option');
update_field('hero_lead_in', 'We build', 'option');
update_field('hero_lead_out', 'people love', 'option');
update_field('hero_watch_label', 'Watch our story', 'option');

update_field('wwd_eyebrow', 'What We Do', 'option');
update_field('wwd_heading', 'Everything your brand needs', 'option');
update_field('wwd_heading_accent', 'under one roof.', 'option');
update_field('wwd_body', 'We bring strategy, creativity and technology together to help ambitious organisations build brands, reach the right people, create meaningful experiences and grow.', 'option');
update_field('wwd_cta_label', 'Explore our capabilities', 'option');

update_field('truth_eyebrow', 'The Truth', 'option');
update_field('truth_heading', 'Every brand wants to be loved.', 'option');
update_field('truth_body', "<p>People choose brands they understand. They return to experiences they enjoy. They share stories that move them. And they use products that make their lives better.</p><p>But sometimes, something gets in the way.</p>", 'option');
if ($truth_img) update_field('truth_image_1', $truth_img, 'option');

update_field('process_eyebrow', 'Our Process', 'option');
update_field('process_heading', 'A clear process for real results.', 'option');
update_field('process_body', 'We combine strategic thinking, creative exploration and technical capability at every step — to solve the right problem and create work that delivers.', 'option');
update_field('process_cta_label', 'See how we work', 'option');
update_field('process_steps', [
  ['num' => '01', 'icon' => 'search', 'title' => 'Understand', 'description' => 'Research. Listen. Find the real problem.'],
  ['num' => '02', 'icon' => 'lightbulb', 'title' => 'Create', 'description' => 'Ideas. Concepts. Experiences.'],
  ['num' => '03', 'icon' => 'target', 'title' => 'Execute', 'description' => 'Bring it to life. Ruthlessly.'],
  ['num' => '04', 'icon' => 'bar-chart-3', 'title' => 'Transform', 'description' => 'New perspectives. Real business impact.'],
], 'option');

update_field('work_eyebrow', 'Featured Work', 'option');
update_field('work_heading', 'Real brands. Real impact.', 'option');
update_field('work_cta_label', 'View All Work', 'option');

update_field('logos_eyebrow', 'Selected Clients', 'option');
update_field('logos_heading', 'Real brands. Real impact.', 'option');
update_field('logos', [
  ['name' => 'Meristem', 'link' => ''],
  ['name' => 'CrusaderSterling', 'link' => ''],
  ['name' => 'Farmfresh / reFresh', 'link' => ''],
  ['name' => 'IBOM Air', 'link' => ''],
], 'option');

update_field('method_eyebrow', 'The Fineries Method', 'option');
update_field('method_body', "Three disciplines. One integrated approach. So good ideas don't get lost between thinking and execution.", 'option');
update_field('method_tagline', 'One team. Fewer gaps. Greater impact.', 'option');
update_field('method_cta_label', 'Learn More', 'option');
update_field('method_circles', [
  ['title' => 'Strategy', 'description' => 'Find the problem worth solving.'],
  ['title' => 'Creativity', 'description' => 'Find the idea worth pursuing.'],
  ['title' => 'Technology', 'description' => 'Build what makes it possible.'],
], 'option');

update_field('bv_eyebrow', 'The Value', 'option');
update_field('bv_heading', 'Good work should do something.', 'option');
update_field('bv_intro', 'It should change perception, create demand, win customers, improve experiences, make work easier and create new opportunities.', 'option');
update_field('bv_items', [
  ['title' => 'Stronger Brands', 'icon' => 'star', 'description' => 'Sharper positioning and identity that lasts.'],
  ['title' => 'Higher Engagement', 'icon' => 'heart', 'description' => 'Content and campaigns people act on.'],
  ['title' => 'Better Experiences', 'icon' => 'badge-check', 'description' => 'Products and services people enjoy using.'],
  ['title' => 'Bigger Customers', 'icon' => 'users', 'description' => 'Reach the right people and convert them.'],
  ['title' => 'Smarter Operations', 'icon' => 'zap', 'description' => 'Systems that save time and reduce friction.'],
  ['title' => 'New Opportunities', 'icon' => 'arrow-up-right', 'description' => 'New models, products and markets to explore.'],
], 'option');

update_field('cta_eyebrow', "Let's Build", 'option');
update_field('cta_lead_in', 'Ready to build', 'option');
update_field('cta_words', 'a brand, a product, content', 'option');
update_field('cta_lead_out', 'people love?', 'option');
update_field('cta_body', "Let's talk.", 'option');
update_field('cta_button_label', 'Start a Conversation', 'option');
if ($hero_img) update_field('cta_image', $hero_img, 'option');

// ---- Site settings (same option store) ----
update_field('seo_title', 'Fineries Digital | We Build Brands, Products, Content People Love | Lagos, Nigeria', 'option');
update_field('seo_description', 'Fineries Digital brings strategy, creativity and technology together to help ambitious organisations grow, connect and create what comes next.', 'option');
update_field('nav_items', [
  ['label' => 'Home', 'link' => '/'],
  ['label' => 'What We Do', 'link' => '#'],
  ['label' => 'Work', 'link' => '#'],
  ['label' => 'About', 'link' => '#'],
  ['label' => 'Insights', 'link' => '#'],
  ['label' => 'Contact', 'link' => '#'],
], 'option');
update_field('footer_tagline', 'We build brands, products, content people love.', 'option');
update_field('footer_services_heading', 'What We Do', 'option');
update_field('footer_company_heading', 'Company', 'option');
update_field('footer_company_links', [
  ['label' => 'About', 'link' => '#'],
  ['label' => 'Work', 'link' => '#'],
  ['label' => 'Insights', 'link' => '#'],
  ['label' => 'Careers', 'link' => '#'],
  ['label' => 'Contact', 'link' => '#'],
], 'option');
update_field('footer_contact_heading', 'Get in Touch', 'option');
update_field('footer_copyright', 'Fineries Digital Limited. All rights reserved.', 'option');
update_field('legal_links', [
  ['label' => 'Privacy', 'link' => '#'],
  ['label' => 'Terms', 'link' => '#'],
], 'option');
update_field('contact_email', 'info@fineries.net', 'option');
update_field('location', 'Lagos, Nigeria', 'option');
update_field('address', 'AHON Towers, 38 CIPM Road, Alausa, Lagos.', 'option');
update_field('social_linkedin', '#', 'option');
update_field('social_instagram', '#', 'option');
update_field('social_x', '#', 'option');

// ---- Services CPT ----
if (!get_posts(['post_type' => 'service', 'numberposts' => 1])) {
  $services = [
    ['Brand & Strategy', '01', 'Find the right position. Build a brand with something to say.', '/services', 'blue', 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=800&q=75'],
    ['Marketing & Growth', '02', 'Reach the right people. Turn attention into action.', '/services', 'gold', 'https://images.unsplash.com/photo-1573497019236-17f8177b81e8?auto=format&fit=crop&w=800&q=75'],
    ['Content & Production', '03', 'Create work worth noticing, remembering and sharing.', '/services', 'magenta', 'https://images.unsplash.com/photo-1594751543129-6701ad444259?auto=format&fit=crop&w=800&q=75'],
    ['Digital Products & Technology', '04', 'Build digital experiences, products and systems that make the business better.', '/technology', 'teal', 'https://images.unsplash.com/photo-1573167243872-43c6433b9d40?auto=format&fit=crop&w=800&q=75'],
    ['Executive & Personal Branding', '05', 'Help leaders become known for what they know and what they stand for.', '/services', 'blue', 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=800&q=75'],
  ];
  $o = 1;
  foreach ($services as $s) {
    $id = wp_insert_post(['post_type' => 'service', 'post_status' => 'publish', 'post_title' => $s[0], 'menu_order' => $o++]);
    update_field('num', $s[1], $id);
    update_field('description', $s[2], $id);
    update_field('link', $s[3], $id);
    update_field('color', $s[4], $id);
    $img = fnr_remote($s[5], $s[0]); if ($img) update_field('image', $img, $id);
  }
}

// ---- Work CPT ----
if (!get_posts(['post_type' => 'work', 'numberposts' => 1])) {
  $works = [
    ['Meristem', 'Brand & digital', 'Brand & digital for a leading investment firm.', 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=800&q=75'],
    ['CrusaderSterling', 'Communications', 'Communications for a financial services organisation.', 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=800&q=75'],
    ['Farmfresh / reFresh', 'Brand & marketing', 'Brand and marketing for iconic yoghurt brands.', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=75'],
    ['IBOM Air', 'Creative & comms', 'Creative and communications for a Nigerian airline brand.', 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?auto=format&fit=crop&w=800&q=75'],
  ];
  $o = 1;
  foreach ($works as $w) {
    $id = wp_insert_post(['post_type' => 'work', 'post_status' => 'publish', 'post_title' => $w[0], 'menu_order' => $o++]);
    update_field('category', $w[1], $id);
    update_field('description', $w[2], $id);
    $img = fnr_remote($w[3], $w[0]); if ($img) update_field('image', $img, $id);
  }
}

WP_CLI::success('Fineries content seeded.');
