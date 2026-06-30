-- ============================================================================
-- AIHub - Seed Data (Regenerated)
-- Idempotent demonstration data for regenerated schema
-- ============================================================================

-- ============================================================================
-- 1. CATEGORIES (Insert categories first)
-- ============================================================================
INSERT INTO public.categories (name, slug, description, icon, color, sort_order, is_featured) VALUES
  ('AI Image Generation', 'ai-image-generation', 'Create and edit photorealistic images and artwork', 'Image', '#ec4899', 1, TRUE),
  ('AI Video Generation', 'ai-video-generation', 'Generate high-fidelity videos and animations', 'Video', '#f59e0b', 2, TRUE),
  ('AI Writing', 'ai-writing', 'AI copywriters, content generators, and text editors', 'FileText', '#6366f1', 3, TRUE),
  ('AI Coding', 'ai-coding', 'AI code completions, editors, and programming assistants', 'Code', '#10b981', 4, TRUE),
  ('AI Voice', 'ai-voice', 'Voice synthesis, cloning, and text-to-speech tools', 'Mic', '#8b5cf6', 5, TRUE),
  ('AI Music', 'ai-music', 'Generate original music, songs, and instruments', 'Music', '#e11d48', 6, TRUE),
  ('AI Marketing', 'ai-marketing', 'SEO, social media, copy generation, and ad campaigns', 'TrendingUp', '#06b6d4', 7, FALSE),
  ('AI Productivity', 'ai-productivity', 'Note-taking, meetings, task automation, and workflows', 'Zap', '#f97316', 8, TRUE),
  ('AI Education', 'ai-education', 'Tutoring, course creation, and learning resources', 'GraduationCap', '#14b8a6', 9, FALSE),
  ('AI Research', 'ai-research', 'Academic papers search, citation engines, and synthesis', 'Search', '#a855f7', 10, FALSE)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 2. USERS (Must exist for author and submitter references)
-- ============================================================================
INSERT INTO public.users (email, full_name, username, avatar_url, bio, role, is_verified) VALUES
  ('admin@aihub.com', 'System Admin', 'admin', 'https://api.dicebear.com/7.x/adventurer/svg?seed=admin', 'Lead architect of AIHub.', 'admin', TRUE),
  ('editor@aihub.com', 'Chief Editor', 'editor', 'https://api.dicebear.com/7.x/adventurer/svg?seed=editor', 'Curator and content lead.', 'moderator', TRUE),
  ('jane@gmail.com', 'Jane Doe', 'jane_doe', 'https://api.dicebear.com/7.x/adventurer/svg?seed=jane', 'AI enthusiast and prompt designer.', 'user', FALSE),
  ('john@gmail.com', 'John Smith', 'john_doe', 'https://api.dicebear.com/7.x/adventurer/svg?seed=john', 'Full stack developer exploring generative AI.', 'user', FALSE)
ON CONFLICT (email) DO NOTHING;

`-- ============================================================================
-- 3. TOOLS (Insert tools after categories and users exist)
-- ============================================================================
INSERT INTO public.tools (name, slug, tagline, description, website_url, category_id, pricing_type, starting_price, is_featured, is_verified, upvote_count, view_count, submitted_by, published_at) VALUES
  ('ChatGPT', 'chatgpt', 'AI-powered conversational assistant by OpenAI', 'ChatGPT is a conversational AI model developed by OpenAI that can write content, debug code, and assist with a wide range of tasks.', 'https://chatgpt.com', (SELECT id FROM public.categories WHERE slug = 'ai-writing'), 'freemium', 20.00, TRUE, TRUE, 15400, 890000, (SELECT id FROM public.users WHERE username = 'admin'), NOW()),
  ('Claude', 'claude', 'Safe and helpful AI assistant by Anthropic', 'Claude is an AI assistant created by Anthropic, designed to excel at technical reasoning, coding, analysis, and nuanced writing.', 'https://claude.ai', (SELECT id FROM public.categories WHERE slug = 'ai-writing'), 'freemium', 20.00, TRUE, TRUE, 12350, 654000, (SELECT id FROM public.users WHERE username = 'editor'), NOW()),
  ('Gemini', 'gemini', 'Google''s next-generation conversational AI ecosystem', 'Gemini is Google''s most capable multimodal model, built from the ground up to understand text, code, audio, and video.', 'https://gemini.google.com', (SELECT id FROM public.categories WHERE slug = 'ai-productivity'), 'freemium', 20.00, TRUE, TRUE, 9870, 543000, (SELECT id FROM public.users WHERE username = 'admin'), NOW()),
  ('Midjourney', 'midjourney', 'Leading text-to-image generator on Discord', 'Midjourney is an AI-powered image generation tool known for its exceptional artistic quality and photorealistic visual output.', 'https://midjourney.com', (SELECT id FROM public.categories WHERE slug = 'ai-image-generation'), 'paid', 10.00, TRUE, TRUE, 18900, 1023000, (SELECT id FROM public.users WHERE username = 'jane_doe'), NOW()),
  ('Ideogram', 'ideogram', 'AI image generator with state-of-the-art text rendering', 'Ideogram is a generative image tool specializing in clear, readable text integration inside graphics, posters, and logos.', 'https://ideogram.ai', (SELECT id FROM public.categories WHERE slug = 'ai-image-generation'), 'freemium', 8.00, FALSE, TRUE, 5430, 234000, (SELECT id FROM public.users WHERE username = 'jane_doe'), NOW()),
  ('Leonardo AI', 'leonardo-ai', 'Generative AI platform for creators and designers', 'Leonardo AI is a suite of visual creation tools featuring real-time canvas editing, 3D texture generation, and model training.', 'https://leonardo.ai', (SELECT id FROM public.categories WHERE slug = 'ai-image-generation'), 'freemium', 12.00, FALSE, TRUE, 7800, 432000, (SELECT id FROM public.users WHERE username = 'jane_doe'), NOW()),
  ('Veo', 'veo', 'Google''s most capable generative video model', 'Veo is Google''s advanced video generation model, capable of producing high-definition 1080p video from text and image prompts.', 'https://deepmind.google/technologies/veo', (SELECT id FROM public.categories WHERE slug = 'ai-video-generation'), 'contact', NULL, TRUE, TRUE, 6500, 321000, (SELECT id FROM public.users WHERE username = 'admin'), NOW()),
  ('Kling', 'kling', 'Advanced AI video generation with realistic physics', 'Kling is a video generation model simulating real-world physics and motion to produce highly realistic clips and scenarios.', 'https://klingai.com', (SELECT id FROM public.categories WHERE slug = 'ai-video-generation'), 'freemium', 10.00, FALSE, TRUE, 4320, 189000, (SELECT id FROM public.users WHERE username = 'editor'), NOW()),
  ('Runway', 'runway', 'AI creative suite for images, videos, and custom models', 'Runway is a pioneering AI research suite providing advanced video-to-video, text-to-video, and cinematic editing capabilities.', 'https://runwayml.com', (SELECT id FROM public.categories WHERE slug = 'ai-video-generation'), 'freemium', 15.00, TRUE, TRUE, 8900, 456000, (SELECT id FROM public.users WHERE username = 'editor'), NOW()),
  ('Cursor', 'cursor', 'The AI-first code editor built for developers', 'Cursor is an online and local editor built on VS Code that features codebase-wide indexing, inline edits, and code generation.', 'https://cursor.com', (SELECT id FROM public.categories WHERE slug = 'ai-coding'), 'freemium', 20.00, TRUE, TRUE, 13400, 567000, (SELECT id FROM public.users WHERE username = 'john_doe'), NOW()),
  ('GitHub Copilot', 'github-copilot', 'Your AI pair programmer integrated into popular IDEs', 'GitHub Copilot suggestions inline code, functions, and whole files in real-time inside VS Code, JetBrains, and Neovim.', 'https://github.com/features/copilot', (SELECT id FROM public.categories WHERE slug = 'ai-coding'), 'paid', 10.00, TRUE, TRUE, 16700, 789000, (SELECT id FROM public.users WHERE username = 'john_doe'), NOW())
ON CONFLICT (slug) DO NOTHING;`

-- ============================================================================
-- 4. TOOL_RANKINGS (Insert rankings after tools exist)
-- ============================================================================
INSERT INTO public.tool_rankings (title, slug, description, category, audience, icon, methodology, tool_id, position, score, highlights, pros, cons) VALUES
  ('Best AI Coding Tools of 2026', 'best-ai-coding-tools-2026', 'A comprehensive ranking of the best AI development tools and code editors.', 'AI Coding', 'Developers', 'Code', 'Evaluated based on code quality, speed, context window, and integrations.', (SELECT id FROM public.tools WHERE slug = 'cursor'), 1, 9.80, 'The leading AI-first code editor that integrates deeply with VS Code extensions.', ARRAY['In-context chat', 'Super-fast inline completions', 'Completely custom codebase indexing'], ARRAY['Can consume significant memory', 'Requires subscription for advanced models']),
  ('Best AI Coding Tools of 2026', 'best-ai-coding-tools-2026', 'A comprehensive ranking of the best AI development tools and code editors.', 'AI Coding', 'Developers', 'Code', 'Evaluated based on code quality, speed, context window, and integrations.', (SELECT id FROM public.tools WHERE slug = 'github-copilot'), 2, 9.40, 'The standard AI companion for every major IDE.', ARRAY['Works in VS Code, JetBrains, Neovim', 'Great multi-line autocomplete', 'Backed by GitHub and Microsoft'], ARRAY['Lacks workspace-wide codebase query interface of Cursor', 'Context window limits']),
  ('Best AI Image Generators of 2026', 'best-ai-image-generators-2026', 'Our ranking of the top text-to-image creative tools.', 'AI Image Generation', 'Designers', 'Image', 'Evaluated based on realism, text rendering, style variety, and prompt adherence.', (SELECT id FROM public.tools WHERE slug = 'midjourney'), 1, 9.70, 'Unmatched artistic aesthetics and photorealism.', ARRAY['Stunning image quality', 'Incredibly detailed textures', 'Active Discord community'], ARRAY['Discord interface can be overwhelming', 'No official API available']),
  ('Best AI Image Generators of 2026', 'best-ai-image-generators-2026', 'Our ranking of the top text-to-image creative tools.', 'AI Image Generation', 'Designers', 'Image', 'Evaluated based on realism, text rendering, style variety, and prompt adherence.', (SELECT id FROM public.tools WHERE slug = 'ideogram'), 2, 9.50, 'The best in rendering text inside generated images.', ARRAY['Perfect spelling and typography rendering', 'Good overall color accuracy', 'Simple web interface'], ARRAY['Less options for custom fine-tuning', 'Relatively slow generation on free tier']),
  ('Best AI Image Generators of 2026', 'best-ai-image-generators-2026', 'Our ranking of the top text-to-image creative tools.', 'AI Image Generation', 'Designers', 'Image', 'Evaluated based on realism, text rendering, style variety, and prompt adherence.', (SELECT id FROM public.tools WHERE slug = 'leonardo-ai'), 3, 9.20, 'Perfect for gaming assets and custom model fine-tuning.', ARRAY['Excellent canvas controls', 'Lots of style pre-sets', 'Ability to train custom models'], ARRAY['Interface is a bit cluttered', 'Free daily credits run out quickly'])
ON CONFLICT (slug, tool_id) DO NOTHING;

-- ============================================================================
-- 5. COMPARISONS (Insert comparisons after tools exist)
-- ============================================================================
INSERT INTO public.comparisons (tool_a_id, tool_b_id, slug, title, summary, verdict, winner_id, view_count, is_published) VALUES
  ((SELECT id FROM public.tools WHERE slug = 'chatgpt'), (SELECT id FROM public.tools WHERE slug = 'claude'), 'chatgpt-vs-claude', 'ChatGPT vs Claude: The Ultimate LLM Comparison', 'A head-to-head comparison of OpenAI''s ChatGPT and Anthropic''s Claude.', 'ChatGPT is best for multimodal tasks and ecosystem integrations, while Claude is preferred for deep technical analysis, programming, and long-form writing.', (SELECT id FROM public.tools WHERE slug = 'claude'), 12500, TRUE),
  ((SELECT id FROM public.tools WHERE slug = 'midjourney'), (SELECT id FROM public.tools WHERE slug = 'ideogram'), 'midjourney-vs-ideogram', 'Midjourney vs Ideogram: Art vs Text', 'Comparing the leading artistic image generator with the text rendering pioneer.', 'Choose Midjourney for cinematic, organic, and ultra-high-detail artwork. Choose Ideogram if your image requires text, logos, or posters.', (SELECT id FROM public.tools WHERE slug = 'midjourney'), 9400, TRUE),
  ((SELECT id FROM public.tools WHERE slug = 'cursor'), (SELECT id FROM public.tools WHERE slug = 'github-copilot'), 'cursor-vs-github-copilot', 'Cursor vs GitHub Copilot: The Battle of AI Editors', 'Analyzing the AI-first IDE against the autocomplete plugin.', 'Cursor offers a superior, more cohesive AI editing experience for complex tasks, while GitHub Copilot remains the best choice for lightweight completion in other editors.', (SELECT id FROM public.tools WHERE slug = 'cursor'), 15300, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 6. PROMPTS (Insert prompts after categories and tools/users exist)
-- ============================================================================
INSERT INTO public.prompts (title, slug, description, prompt_text, example_output, category_id, tool_id, author_id, tags, difficulty, use_count, save_count, upvote_count, is_featured) VALUES
  ('Cinematic Portrait prompt', 'cinematic-portrait-prompt', 'Create photorealistic cinematic portraits with Midjourney', 'Cinematic portrait of a sailor, weathered face, rain droplets on cheeks, dramatic lightning, photorealistic, 8k resolution, cinematic lighting, shot on 85mm lens', 'A highly detailed photo of an elderly sailor on a ship deck during a storm, illuminated by a warm lantern.', (SELECT id FROM public.categories WHERE slug = 'ai-image-generation'), (SELECT id FROM public.tools WHERE slug = 'midjourney'), (SELECT id FROM public.users WHERE username = 'jane_doe'), ARRAY['midjourney', 'portrait', 'cinematic'], 'intermediate', 450, 120, 89, TRUE),
  ('Tailwind Landing Page generator', 'tailwind-landing-page-generator', 'Generate high-converting SaaS landing pages with Claude', 'Write a clean, responsive single-page landing page using HTML and Tailwind CSS. The page is for an AI productivity app. Use modern design patterns, a dark theme, and standard sections.', 'A complete HTML template with responsive navbar, hero section, features grid, pricing table, and newsletter footer.', (SELECT id FROM public.categories WHERE slug = 'ai-coding'), (SELECT id FROM public.tools WHERE slug = 'claude'), (SELECT id FROM public.users WHERE username = 'john_doe'), ARRAY['tailwind', 'html', 'frontend'], 'advanced', 1200, 340, 210, TRUE),
  ('Cold Email Campaign copywriter', 'cold-email-campaign-copywriter', 'Write highly effective cold B2B outreach email sequences', 'Act as an expert B2B copywriter. Write a 3-step cold email sequence targeting CTOs for our developer productivity tool.', 'A 3-step email sequence highlighting problems, proposing solutions, and including a clear low-friction call-to-action.', (SELECT id FROM public.categories WHERE slug = 'ai-writing'), (SELECT id FROM public.tools WHERE slug = 'chatgpt'), (SELECT id FROM public.users WHERE username = 'editor'), ARRAY['copywriting', 'marketing', 'emails'], 'beginner', 840, 190, 115, FALSE)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 7. TUTORIALS (Insert tutorials after categories and tools/users exist)
-- ============================================================================
INSERT INTO public.tutorials (title, slug, excerpt, content, category_id, author_id, difficulty, read_time_minutes, tags, related_tool_ids, view_count, is_featured) VALUES
  ('Mastering Midjourney V6: Photorealism Secrets', 'mastering-midjourney-v6-photorealism', 'Learn how to generate ultra-realistic images using specific parameters and prompting styles.', 'To get photorealistic results in Midjourney, you need to master lighting, cameras, and detail tokens. Learn how to write style references, set aspect ratios, and choose standard lens values like --style raw.', (SELECT id FROM public.categories WHERE slug = 'ai-image-generation'), (SELECT id FROM public.users WHERE username = 'jane_doe'), 'intermediate', 10, ARRAY['midjourney', 'art', 'photorealism'], ARRAY[(SELECT id FROM public.tools WHERE slug = 'midjourney')], 3500, TRUE),
  ('Building a Next.js App with Cursor', 'building-nextjs-with-cursor', 'A step-by-step tutorial on building a full-stack Next.js app in under an hour using Cursor.', 'In this tutorial, we will set up a fresh Next.js project and use Cursor''s codebase indexing to generate API routes and database interfaces instantly.', (SELECT id FROM public.categories WHERE slug = 'ai-coding'), (SELECT id FROM public.users WHERE username = 'john_doe'), 'beginner', 15, ARRAY['nextjs', 'coding', 'cursor'], ARRAY[(SELECT id FROM public.tools WHERE slug = 'cursor')], 5800, TRUE),
  ('Effective Prompt Engineering for Claude 3.5 Sonnet', 'prompt-engineering-claude-sonnet', 'Discover how to craft prompts that leverage Claude''s long context window and XML tagging capabilities.', 'Claude 3.5 Sonnet excels at structured thinking. Using XML tags like <context> or <instructions> helps Claude segment input text and deliver dramatically better structured outputs.', (SELECT id FROM public.categories WHERE slug = 'ai-writing'), (SELECT id FROM public.users WHERE username = 'editor'), 'advanced', 12, ARRAY['claude', 'anthropic', 'prompting'], ARRAY[(SELECT id FROM public.tools WHERE slug = 'claude')], 4200, FALSE)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 8. NEWS (Insert news after categories and tools/users exist)
-- ============================================================================
INSERT INTO public.news (title, slug, excerpt, content, source_name, source_url, category_id, author_id, tags, related_tool_ids, view_count, is_featured, is_breaking) VALUES
  ('Google Announces Veo: High-Quality Generative Video Model', 'google-announces-veo', 'Google unveiled its most advanced video generator, Veo, producing photorealistic clips at 1080p.', 'Veo is Google''s new state-of-the-art generative video model. It creates high-definition video from text, image, and video prompts. Veo understands cinematic terms and camera movements, producing cinema-quality clips.', 'Google Blog', 'https://deepmind.google/technologies/veo', (SELECT id FROM public.categories WHERE slug = 'ai-video-generation'), (SELECT id FROM public.users WHERE username = 'editor'), ARRAY['google', 'veo', 'video-generation'], ARRAY[(SELECT id FROM public.tools WHERE slug = 'veo')], 18500, TRUE, TRUE),
  ('OpenAI Launches GPT-4o for All Users', 'openai-launches-gpt-4o', 'OpenAI introduces its new flagship multimodal model, GPT-4o, combining audio, vision, and text.', 'GPT-4o is OpenAI''s new flagship model. It is twice as fast as GPT-4 Turbo, 50% cheaper in the API, and offers advanced voice and vision capabilities for free users as well.', 'OpenAI News', 'https://openai.com/blog', (SELECT id FROM public.categories WHERE slug = 'ai-productivity'), (SELECT id FROM public.users WHERE username = 'admin'), ARRAY['openai', 'chatgpt', 'gpt-4o'], ARRAY[(SELECT id FROM public.tools WHERE slug = 'chatgpt')], 23000, TRUE, FALSE)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 9. REVIEWS (Insert reviews only after tools and users exist)
-- ============================================================================
INSERT INTO public.reviews (tool_id, user_id, rating, title, content, pros, cons, is_verified_purchase, is_approved) VALUES
  ((SELECT id FROM public.tools WHERE slug = 'chatgpt'), (SELECT id FROM public.users WHERE username = 'jane_doe'), 5, 'Indispensable Daily Companion', 'I use ChatGPT for everything from writing emails to planning trips. The UI is simple, fast, and the voice feature is amazing.', ARRAY['Voice mode is extremely natural', 'DALL-E 3 integration is very convenient'], ARRAY['Sometimes gives generic responses', 'Web browsing can be slow'], TRUE, TRUE),
  ((SELECT id FROM public.tools WHERE slug = 'claude'), (SELECT id FROM public.users WHERE username = 'john_doe'), 5, 'Best for Programming Tasks', 'Claude 3.5 Sonnet is a developer''s dream. Its reasoning is far ahead of ChatGPT for coding and analyzing documentation.', ARRAY['Outstanding code generation', 'XML tag prompt formatting works brilliantly', 'Large context window'], ARRAY['Lack of web search integration in free tier', 'No built-in image generator'], TRUE, TRUE),
  ((SELECT id FROM public.tools WHERE slug = 'cursor'), (SELECT id FROM public.users WHERE username = 'john_doe'), 5, 'Replaced VS Code Completely', 'Cursor is by far the best coding editor. It indexes the entire repository and knows exactly how code files interact.', ARRAY['Full codebase indexing is a game changer', 'Composer mode edits multiple files'], ARRAY['Subscription pricing is high for hobbyists'], TRUE, TRUE),
  ((SELECT id FROM public.tools WHERE slug = 'midjourney'), (SELECT id FROM public.users WHERE username = 'jane_doe'), 4, 'Best Image Quality, Hard Interface', 'Midjourney produces the most artistic images, but having to run it in Discord is not ideal. Looking forward to a full web interface.', ARRAY['Incredible photorealism', 'Amazing textures and styles'], ARRAY['Discord interface is messy', 'Paid only, no free trial'], FALSE, TRUE)
ON CONFLICT (tool_id, user_id) DO NOTHING;

-- ============================================================================
-- 10. BOOKMARKS (Insert bookmarks only after users and tools exist)
-- ============================================================================
INSERT INTO public.bookmarks (user_id, bookmarkable_type, bookmarkable_id) VALUES
  ((SELECT id FROM public.users WHERE username = 'jane_doe'), 'tool', (SELECT id FROM public.tools WHERE slug = 'midjourney')),
  ((SELECT id FROM public.users WHERE username = 'jane_doe'), 'tool', (SELECT id FROM public.tools WHERE slug = 'ideogram')),
  ((SELECT id FROM public.users WHERE username = 'john_doe'), 'tool', (SELECT id FROM public.tools WHERE slug = 'cursor')),
  ((SELECT id FROM public.users WHERE username = 'john_doe'), 'tool', (SELECT id FROM public.tools WHERE slug = 'github-copilot'))
ON CONFLICT (user_id, bookmarkable_type, bookmarkable_id) DO NOTHING;
