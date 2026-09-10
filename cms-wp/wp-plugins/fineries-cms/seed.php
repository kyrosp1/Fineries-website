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

// ---- What We Do page (options) ----
update_field('wwd_hero_eyebrow', 'What We Do', 'option');
update_field('wwd_hero_heading', 'Different problems need different answers.', 'option');
update_field('wwd_hero_body', "<p>Sometimes you need to rethink the brand. Sometimes you need to reach more people. Sometimes you need a campaign people can't ignore. Sometimes you need to build an entirely new product.</p><p>We bring the capabilities together to help you figure out what needs to happen, then make it happen.</p>", 'option');
update_field('wwd_hero_cta_label', 'Explore our capabilities', 'option');
update_field('wwd_hero_tags', 'Brands, Products, People, Possibilities', 'option');
update_field('wwd_intro_eyebrow', 'How we work', 'option');
update_field('wwd_intro_heading', 'Strategy before services.', 'option');
update_field('wwd_intro_body', "<p>We don't start by asking which service we can sell you. We start with the problem.</p><p>What needs to change? What are we trying to achieve? Who are we trying to move? What's getting in the way?</p><p><strong>The answer determines what we do next.</strong></p>", 'option');
update_field('wwd_caps_eyebrow', 'Capabilities', 'option');
update_field('wwd_caps_heading', 'Our capabilities', 'option');
update_field('wwd_caps_tagline', 'Five disciplines. One purpose.', 'option');
update_field('wwd_seo_title', 'What We Do | Fineries Digital', 'option');
update_field('wwd_seo_description', 'Brand & strategy, marketing & growth, content & production, digital products & technology, and executive branding — the capabilities Fineries brings together to solve the right problem.', 'option');

// ---- Web & App page (Digital Products & Technology) ----
update_field('dpt_hero_eyebrow', 'Digital Products & Technology', 'option');
update_field('dpt_hero_heading', 'What if technology could do more for your business?', 'option');
update_field('dpt_hero_body', 'From winning more customers to improving operations, we use strategy, creativity and technology to build solutions that move businesses forward.', 'option');
update_field('dpt_hero_cta_label', 'Start a Project', 'option');
update_field('dpt_de_eyebrow', 'The shift', 'option');
update_field('dpt_de_heading', 'The digital experience is now part of the business.', 'option');
update_field('dpt_de_body', "<p>Your digital experience shapes how people see your business. A slow website. A confusing journey. A manual process. A fragmented experience.</p><p>Small digital problems can become big business problems. The question is: is your digital experience creating value, or getting in the way?</p>", 'option');
update_field('dpt_value_heading', 'Where our solutions create value', 'option');
update_field('dpt_value_intro', 'We focus on the business outcomes behind the technology.', 'option');
update_field('dpt_value_items', [
  ['icon' => 'trending-up', 'title' => 'Grow revenue', 'description' => 'Create better pathways from awareness to consideration to conversion.'],
  ['icon' => 'user-plus', 'title' => 'Acquire customers', 'description' => 'Build digital experiences that attract the right audiences and turn attention into action.'],
  ['icon' => 'star', 'title' => 'Strengthen the brand', 'description' => 'Translate your brand promise into every digital interaction.'],
  ['icon' => 'rocket', 'title' => 'Create new business', 'description' => 'Turn new ideas into digital products, platforms and entirely new revenue opportunities.'],
], 'option');
update_field('dpt_build_eyebrow', 'What We Build', 'option');
update_field('dpt_build_heading', 'From websites to entirely new ventures.', 'option');
update_field('dpt_build_items', [
  ['icon' => 'globe', 'title' => 'Digital experiences', 'description' => 'Websites and digital platforms that communicate value, build trust and drive action.', 'services' => "Corporate websites\nE-commerce\nCampaign platforms\nLanding pages\nDigital redesigns"],
  ['icon' => 'layout-dashboard', 'title' => 'Digital products', 'description' => 'Web applications that transform processes, services and business models.', 'services' => "Customer portals\nDashboards\nSaaS\nMarketplaces\nBusiness systems\nPlatforms"],
  ['icon' => 'smartphone', 'title' => 'Mobile experiences', 'description' => "Mobile apps that put products, services and communities directly in customers' hands.", 'services' => "Customer apps\nFintech\nCommerce\nService platforms"],
  ['icon' => 'rocket', 'title' => 'New digital ventures', 'description' => 'Turn new ideas into digital products and platforms — from concept to launch.', 'services' => "Product strategy\nMVPs\nPrototyping\nProduct design\nDevelopment\nLaunch"],
], 'option');
update_field('dpt_seo_title', 'Web & App Development | Fineries Digital', 'option');
update_field('dpt_seo_description', 'We use strategy, creativity and technology to build websites, web apps, mobile apps and new digital ventures that move businesses forward.', 'option');

// ---- Brand & Strategy page ----
update_field('bs_hero_eyebrow', 'Brand & Strategy', 'option');
update_field('bs_hero_heading', 'Give your brand something to stand for.', 'option');
update_field('bs_hero_body', "<p>Great brands aren't built by starting with a logo.</p><p>They're built by understanding the business, the market, the people you want to reach and the place you want to occupy in their minds.</p><p><strong>That's where we start.</strong></p>", 'option');
update_field('bs_hero_video_desktop', 'https://cms.fineries.net/wp-content/plugins/fineries-cms/assets/media/web-app-hero-landscape.mp4', 'option');
update_field('bs_hero_video_mobile', 'https://cms.fineries.net/wp-content/plugins/fineries-cms/assets/media/web-app-hero-mobile.mp4', 'option');
update_field('bs_hero_poster', 'https://cms.fineries.net/wp-content/plugins/fineries-cms/assets/media/web-app-hero-poster.png', 'option');
update_field('bs_problem_eyebrow', 'The Problem', 'option');
update_field('bs_problem_heading', 'Clarity changes everything.', 'option');
update_field('bs_problem_body', '<p>When the strategy is clear, decisions become easier.</p><p>We help organisations find the answers.</p>', 'option');
update_field('bs_problem_questions', "What should we say?\nWho should we speak to?\nHow should we look?\nWhere should we compete?\nWhy should anyone choose us?", 'option');
update_field('bs_services_eyebrow', 'What We Do', 'option');
update_field('bs_services_heading', 'Build from a clear point of view.', 'option');
update_field('bs_services', [
  ['icon' => 'search', 'title' => 'Research & Insights', 'description' => 'Understand your audience, market, competitors and opportunities.'],
  ['icon' => 'compass', 'title' => 'Brand Strategy', 'description' => 'Define the thinking that guides the brand.'],
  ['icon' => 'map-pin', 'title' => 'Positioning', 'description' => "Own a meaningful place in people's minds."],
  ['icon' => 'network', 'title' => 'Brand Architecture', 'description' => 'Create clarity across brands, products and services.'],
  ['icon' => 'shapes', 'title' => 'Identity', 'description' => 'Turn strategy into a distinctive visual and verbal system.'],
  ['icon' => 'message-square', 'title' => 'Messaging', 'description' => 'Find the words that make what you do matter.'],
], 'option');
update_field('bs_cta_heading', 'Give people a reason to choose you.', 'option');
update_field('bs_cta_label', 'Talk to us about your brand', 'option');
update_field('bs_cta_link', '#contact', 'option');
update_field('bs_seo_title', 'Brand & Strategy | Fineries Digital', 'option');
update_field('bs_seo_description', 'Brand research, strategy, positioning, architecture, identity and messaging that give people a reason to choose you.', 'option');

// ---- Site settings (same option store) ----
update_field('seo_title', 'Fineries Digital | We Build Brands, Products, Content People Love | Lagos, Nigeria', 'option');
update_field('seo_description', 'Fineries Digital brings strategy, creativity and technology together to help ambitious organisations grow, connect and create what comes next.', 'option');
update_field('nav_items', [
  ['label' => 'Home', 'link' => '/'],
  ['label' => 'What We Do', 'link' => '/what-we-do'],
  ['label' => 'Work', 'link' => '#'],
  ['label' => 'About', 'link' => '/about'],
  ['label' => 'Insights', 'link' => '#'],
  ['label' => 'Contact', 'link' => '/contact'],
], 'option');
update_field('footer_tagline', 'We build brands, products, content people love.', 'option');
update_field('footer_services_heading', 'What We Do', 'option');
update_field('footer_company_heading', 'Company', 'option');
update_field('footer_company_links', [
  ['label' => 'About', 'link' => '/about'],
  ['label' => 'Work', 'link' => '#'],
  ['label' => 'Insights', 'link' => '#'],
  ['label' => 'Careers', 'link' => '#'],
  ['label' => 'Contact', 'link' => '/contact'],
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
  $fnr_subservices = [
    '01' => [
      ['icon' => 'search', 'title' => 'Research & Insights', 'description' => 'We uncover the customer, market and cultural insights that help you make better brand decisions.'],
      ['icon' => 'compass', 'title' => 'Brand Strategy', 'description' => 'We define the thinking that gives your brand direction and helps everyone build towards the same goal.'],
      ['icon' => 'map-pin', 'title' => 'Brand Positioning', 'description' => 'We help you define a distinctive and relevant place for your brand in the minds of the people you want to reach.'],
      ['icon' => 'network', 'title' => 'Brand Architecture', 'description' => 'We bring clarity to the relationship between your company, brands, products and services.'],
      ['icon' => 'shapes', 'title' => 'Brand Identity Systems', 'description' => 'We turn your strategy into a distinctive visual identity and a flexible system for how the brand shows up.'],
      ['icon' => 'signature', 'title' => 'Naming', 'description' => 'We create names that are distinctive, relevant and built to support the brand you want to become.'],
      ['icon' => 'message-square', 'title' => 'Brand Messaging', 'description' => 'We define the messages that make your value clear, relevant and compelling.'],
      ['icon' => 'quote', 'title' => 'Verbal Identity', 'description' => 'We give your brand a distinctive way of speaking that sounds recognisably yours.'],
      ['icon' => 'book-open', 'title' => 'Brand Guidelines', 'description' => 'We turn your brand system into practical guidance that helps everyone use it properly.'],
    ],
    '02' => [
      ['icon' => 'chart-no-axes-combined', 'title' => 'Marketing Strategy', 'description' => 'We build focused marketing strategies around the audiences, opportunities and business results that matter most.'],
      ['icon' => 'megaphone', 'title' => 'Campaign Strategy & Integrated Campaigns', 'description' => 'We turn business objectives into connected campaigns built to move the right people to act.'],
      ['icon' => 'mouse-pointer-click', 'title' => 'Digital Marketing', 'description' => 'We use digital channels to reach the right audiences, create demand and turn attention into measurable action.'],
      ['icon' => 'badge-dollar-sign', 'title' => 'Performance Advertising', 'description' => 'We plan, run and optimise paid campaigns designed to deliver measurable business results.'],
      ['icon' => 'messages-square', 'title' => 'Social Media Marketing', 'description' => 'We turn social channels into useful platforms for building relevance, community and business growth.'],
      ['icon' => 'users', 'title' => 'Influencer Marketing', 'description' => 'We connect brands with credible creators who can take the message to the right communities.'],
      ['icon' => 'search', 'title' => 'SEO', 'description' => 'We improve how easily people can discover your business when they are actively searching for what you offer.'],
      ['icon' => 'notebook-tabs', 'title' => 'Content Marketing', 'description' => 'We use useful, relevant content to attract audiences, build authority and create demand over time.'],
      ['icon' => 'radio-tower', 'title' => 'Media Planning & Buying', 'description' => 'We help you put the right message in the right places, in front of the right people, at the right scale.'],
      ['icon' => 'filter', 'title' => 'Lead Generation', 'description' => 'We build campaigns and journeys designed to turn interest into qualified opportunities for your business.'],
      ['icon' => 'sliders-horizontal', 'title' => 'Campaign Optimisation', 'description' => 'We use live performance data to improve campaigns while they are running.'],
      ['icon' => 'line-chart', 'title' => 'Analytics & Reporting', 'description' => 'We turn marketing data into clear answers about what is working, what is not and what to do next.'],
    ],
    '03' => [
      ['icon' => 'lightbulb', 'title' => 'Creative Direction', 'description' => 'We develop the creative direction that gives your campaign or content a distinctive, coherent point of view.'],
      ['icon' => 'megaphone', 'title' => 'Campaign Concepts', 'description' => 'We develop big creative ideas that give people a reason to notice, remember and respond.'],
      ['icon' => 'film', 'title' => 'Video Production', 'description' => 'We create films and video content that turn your message into something people want to watch.'],
      ['icon' => 'camera', 'title' => 'Photography', 'description' => 'We create original photography that gives your brand a distinctive and ownable visual presence.'],
      ['icon' => 'move-3d', 'title' => 'Motion Design & Animation', 'description' => 'We use motion and animation to make ideas clearer, more engaging and harder to ignore.'],
      ['icon' => 'smartphone', 'title' => 'Social Content', 'description' => 'We create platform-aware content designed to earn attention in fast-moving social feeds.'],
      ['icon' => 'pen-line', 'title' => 'Copywriting', 'description' => 'We find the words that make your message clearer, sharper and more persuasive.'],
      ['icon' => 'badge', 'title' => 'Branded Content', 'description' => 'We create useful or entertaining content people choose to spend time with, with your brand naturally at its centre.'],
      ['icon' => 'sparkles', 'title' => 'AI-assisted Content Production', 'description' => 'We combine human creative direction with AI tools to produce quality content faster and at greater scale.'],
    ],
    '04' => [
      ['icon' => 'globe', 'title' => 'Websites', 'description' => 'We design and build websites that strengthen your brand and help visitors take the next step.'],
      ['icon' => 'panels-top-left', 'title' => 'Web Applications', 'description' => 'We build browser-based applications around the specific things your customers, employees or partners need to accomplish.'],
      ['icon' => 'smartphone', 'title' => 'Mobile Applications', 'description' => 'We design and build mobile apps that make useful services accessible wherever your customers are.'],
      ['icon' => 'layout-dashboard', 'title' => 'Digital Platforms', 'description' => 'We build platforms that connect people, services, information and transactions in one digital environment.'],
      ['icon' => 'shopping-cart', 'title' => 'E-commerce', 'description' => 'We create commerce experiences that make it easier for customers to discover, choose and buy.'],
      ['icon' => 'user-round-cog', 'title' => 'Customer Portals', 'description' => 'We give customers a secure, convenient place to access services, information and manage their relationship with you.'],
      ['icon' => 'wrench', 'title' => 'Internal Tools & Business Systems', 'description' => 'We build purpose-made systems that remove repetitive work and help teams run the business more effectively.'],
      ['icon' => 'panel-top', 'title' => 'UI/UX Design', 'description' => 'We design digital experiences that make complex products feel clear, intuitive and easy to use.'],
      ['icon' => 'brain-circuit', 'title' => 'AI Solutions & Automation', 'description' => 'We use AI and automation to reduce repetitive work, improve experiences and unlock useful new capabilities.'],
      ['icon' => 'blocks', 'title' => 'Systems Integration', 'description' => 'We connect the tools and systems your business relies on so information can move between them more effectively.'],
    ],
    '05' => [
      ['icon' => 'target', 'title' => 'Executive Positioning', 'description' => 'We define the space you want to own and the ideas you want to become known for.'],
      ['icon' => 'fingerprint', 'title' => 'Personal Brand Strategy', 'description' => 'We build a practical strategy for turning your expertise and reputation into a stronger public brand.'],
      ['icon' => 'lightbulb', 'title' => 'Thought Leadership', 'description' => 'We turn what you know into ideas and perspectives that contribute meaningfully to your industry.'],
      ['icon' => 'notebook-tabs', 'title' => 'Content Strategy', 'description' => 'We create a sustainable plan for what you should talk about, where and why.'],
      ['icon' => 'linkedin', 'title' => 'LinkedIn Strategy', 'description' => 'We turn LinkedIn into a deliberate platform for visibility, authority and professional opportunity.'],
      ['icon' => 'pen-tool', 'title' => 'Executive Content', 'description' => 'We create high-quality content that captures your thinking and still sounds like you.'],
      ['icon' => 'shapes', 'title' => 'Personal Visual Identity', 'description' => 'We create a professional visual system that makes your personal brand consistent and recognisable.'],
      ['icon' => 'award', 'title' => 'Visibility & Reputation', 'description' => 'We help you build the visibility and credibility that make the right people take notice.'],
    ],
  ];
  $services = [
    ['Brand & Strategy', '01', 'Find the right position. Build a brand with something to say.', '/brand-and-strategy', 'blue', 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=800&q=75'],
    ['Marketing & Growth', '02', 'Reach the right people. Turn attention into action.', '/marketing-and-growth', 'gold', 'https://images.unsplash.com/photo-1573497019236-17f8177b81e8?auto=format&fit=crop&w=800&q=75'],
    ['Content & Production', '03', 'Create work worth noticing, remembering and sharing.', '/content-and-production', 'magenta', 'https://images.unsplash.com/photo-1594751543129-6701ad444259?auto=format&fit=crop&w=800&q=75'],
    ['Digital Products & Technology', '04', 'Build digital experiences, products and systems that make the business better.', '/digital-and-tech', 'teal', 'https://images.unsplash.com/photo-1573167243872-43c6433b9d40?auto=format&fit=crop&w=800&q=75'],
    ['Executive & Personal Branding', '05', 'Help leaders become known for what they know and what they stand for.', '/executive-and-personal-branding', 'blue', 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=800&q=75'],
  ];
  $o = 1;
  foreach ($services as $s) {
    $id = wp_insert_post(['post_type' => 'service', 'post_status' => 'publish', 'post_title' => $s[0], 'menu_order' => $o++]);
    update_field('num', $s[1], $id);
    update_field('description', $s[2], $id);
    update_field('link', $s[3], $id);
    update_field('color', $s[4], $id);
    $img = fnr_remote($s[5], $s[0]); if ($img) update_field('image', $img, $id);
    if (!empty($fnr_subservices[$s[1]])) update_field('cap_subservices', $fnr_subservices[$s[1]], $id);
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
