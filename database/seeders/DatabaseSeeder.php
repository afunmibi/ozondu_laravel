<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Post;
use App\Models\SocialLink;
use App\Models\Subscriber;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user (or update existing)
        $admin = User::updateOrCreate(
            ['email' => 'afunmibi@gmail.com'],
            [
                'name' => 'Afunmibi',
                'password' => Hash::make('Ilare2026'),
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'amuyiwa20@gmail.com'],
            [
                'name' => 'Hon. Muywa Adewale Ozondu',
                'password' => Hash::make('Ilare2026'),
                'email_verified_at' => now(),
            ]
        );

        // Create categories
        $categories = [
            ['name' => 'Politics', 'color' => '#1B5E20', 'description' => 'Political updates and announcements'],
            ['name' => 'Development', 'color' => '#0D47A1', 'description' => 'Infrastructure and development news'],
            ['name' => 'Events', 'color' => '#FF8F00', 'description' => 'Community events and meetings'],
            ['name' => 'Announcements', 'color' => '#C62828', 'description' => 'Official announcements'],
            ['name' => 'Opinion', 'color' => '#6A1B9A', 'description' => 'Views and opinions on local issues'],
        ];

        foreach ($categories as $cat) {
            Category::create([
                'name' => $cat['name'],
                'slug' => Str::slug($cat['name']),
                'description' => $cat['description'],
                'color' => $cat['color'],
            ]);
        }

        // Create sample posts
        $posts = [
            [
                'title' => 'Construction of New Market Road Begins in Ilare',
                'excerpt' => 'Work has commenced on the much-awaited market road construction project.',
                'content' => '<p>We are excited to announce that construction has officially begun on the new market road.</p><p>This project will connect the main market to the expressway, reducing travel time and improving accessibility.</p><h3>Project Details</h3><ul><li>Length: 3.5 kilometers</li><li>Duration: 6 months</li><li>Employment: 200+ local workers</li></ul>',
                'category' => 'Development',
                'is_featured' => true,
                'status' => 'published',
            ],
            [
                'title' => 'Monthly Town Hall Meeting Holding Next Saturday',
                'excerpt' => 'Join us for our monthly community meeting.',
                'content' => '<p>Our monthly town hall meeting is scheduled for the last Saturday of this month.</p><h3>Agenda</h3><ul><li>Update on road construction projects</li><li>Discussion on waste management</li><li>Youth empowerment programs</li><li>Open forum for questions</li></ul>',
                'category' => 'Events',
                'is_featured' => true,
                'status' => 'published',
            ],
            [
                'title' => 'Youth Empowerment Program Registration Opens',
                'excerpt' => 'Applications are now open for our skill acquisition program.',
                'content' => '<p>We are pleased to announce the opening of registration for our annual youth empowerment program.</p><p>This program offers training in Computer literacy, Vocational skills, Entrepreneurship development, and Agricultural techniques.</p>',
                'category' => 'Announcements',
                'is_featured' => false,
                'status' => 'published',
            ],
            [
                'title' => 'My Vision for a Greater Ilare Ward',
                'excerpt' => 'An outline of my commitment to transparent governance.',
                'content' => '<p>As your representative, I am committed to ensuring that every decision we make is in the best interest of our community.</p><p>My vision centers on Transparency, Inclusivity, and Development.</p><p>Together, we can build the Ilare Ward we deserve.</p><p>I am Hon. Muywa Adewale Ozondu, and I serve with dedication and integrity.</p>',
                'category' => 'Opinion',
                'is_featured' => false,
                'status' => 'published',
            ],
            [
                'title' => 'Water Project Completed in Five Communities',
                'excerpt' => 'Clean water is now accessible to residents of five communities.',
                'content' => '<p>We are thrilled to announce the completion of our water project that has brought clean water to five communities.</p><p>Over 3,000 households now have access to safe drinking water.</p>',
                'category' => 'Development',
                'is_featured' => true,
                'status' => 'published',
            ],
        ];

        foreach ($posts as $post) {
            $category = Category::where('name', $post['category'])->first();
            
            Post::create([
                'title' => $post['title'],
                'slug' => Str::slug($post['title']),
                'excerpt' => $post['excerpt'],
                'content' => $post['content'],
                'category_id' => $category->id,
                'author_id' => $admin->id,
                'status' => $post['status'],
                'is_featured' => $post['is_featured'],
                'published_at' => now()->subDays(rand(1, 30)),
                'views' => rand(50, 500),
            ]);
        }

        // Create social links
        $socialLinks = [
            ['platform' => 'facebook', 'name' => 'Facebook', 'url' => 'https://facebook.com/ozondu', 'icon' => 'bi-facebook', 'color' => '#1877F2', 'order' => 1],
            ['platform' => 'twitter', 'name' => 'Twitter / X', 'url' => 'https://twitter.com/ozondu', 'icon' => 'bi-twitter-x', 'color' => '#000000', 'order' => 2],
            ['platform' => 'whatsapp', 'name' => 'WhatsApp', 'url' => 'https://chat.whatsapp.com/xxxxx', 'icon' => 'bi-whatsapp', 'color' => '#25D366', 'order' => 3],
            ['platform' => 'telegram', 'name' => 'Telegram', 'url' => 'https://t.me/ozondu', 'icon' => 'bi-telegram', 'color' => '#0088CC', 'order' => 4],
        ];

        foreach ($socialLinks as $link) {
            SocialLink::create($link);
        }

        // Create sample subscribers
        $subscribers = [
            ['name' => 'Adekunle Adeyemi', 'email' => 'adekunle@example.com', 'is_verified' => true],
            ['name' => 'Folake Samuel', 'email' => 'folake@example.com', 'is_verified' => true],
            ['name' => 'Oluwaseun Taiwo', 'email' => 'seun@example.com', 'is_verified' => true],
        ];

        foreach ($subscribers as $sub) {
            Subscriber::create([
                'name' => $sub['name'],
                'email' => $sub['email'],
                'token' => Str::random(64),
                'is_verified' => $sub['is_verified'],
                'status' => 'active',
                'subscribed_at' => now()->subDays(rand(1, 60)),
            ]);
        }

        $this->command->info('Database seeded successfully!');
        $this->command->info('Admin login: afunmibi@gmail.com / Ilare2026');
        $this->command->info('Admin login: amuyiwa20@gmail.com / Ilare2026');
    }
}
