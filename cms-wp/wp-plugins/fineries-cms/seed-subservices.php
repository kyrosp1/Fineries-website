<?php
/* Targeted, non-destructive populate of the service CPT 'cap_subservices' repeater.
   Run: wp eval-file .../fineries-cms/seed-subservices.php
   Only sets subservices on a service whose cap_subservices is currently EMPTY —
   never overwrites existing client edits. Safe to re-run. */
if (!function_exists('get_field')) { echo "ACF not active\n"; return; }

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

$posts = get_posts(['post_type' => 'service', 'numberposts' => -1]);
foreach ($posts as $p) {
  $num = get_field('num', $p->ID);
  if (empty($fnr_subservices[$num])) { echo "skip (no data for num ): {$p->post_title}\n"; continue; }
  $existing = get_field('cap_subservices', $p->ID);
  if (!empty($existing)) { echo "skip (already set): {$p->post_title}\n"; continue; }
  update_field('cap_subservices', $fnr_subservices[$num], $p->ID);
  echo "set " . count($fnr_subservices[$num]) . " subservices on: {$p->post_title}\n";
}
echo "done\n";
