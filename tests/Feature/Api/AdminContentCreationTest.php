<?php

namespace Tests\Feature\Api;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminContentCreationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_post_creation_generates_a_unique_slug_and_sets_the_author(): void
    {
        [$user, $token] = $this->createAuthenticatedUser();

        $category = Category::create([
            'name' => 'News',
            'description' => 'Latest news',
            'color' => '#0f766e',
        ]);

        Post::create([
            'title' => 'Same Title',
            'slug' => 'same-title',
            'category_id' => $category->id,
            'author_id' => $user->id,
            'content' => 'Existing content',
            'status' => 'draft',
        ]);

        $response = $this
            ->withHeaders($this->apiHeaders($token))
            ->post('/api/v1/admin/posts', [
                'title' => 'Same Title',
                'category_id' => (string) $category->id,
                'excerpt' => 'Fresh excerpt',
                'content' => 'Fresh content',
                'status' => 'draft',
                'is_featured' => '0',
            ]);

        $response
            ->assertCreated()
            ->assertJsonPath('slug', 'same-title-2')
            ->assertJsonPath('author_id', $user->id)
            ->assertJsonPath('is_featured', false);

        $this->assertDatabaseHas('posts', [
            'title' => 'Same Title',
            'slug' => 'same-title-2',
            'author_id' => $user->id,
            'is_featured' => 0,
        ]);
    }

    public function test_admin_slider_creation_defaults_empty_sort_order_and_casts_status(): void
    {
        Storage::fake('public');

        [, $token] = $this->createAuthenticatedUser();

        $response = $this
            ->withHeaders($this->apiHeaders($token))
            ->post('/api/v1/admin/sliders', [
                'title' => 'Hero Slide',
                'subtitle' => 'Community first',
                'image' => $this->fakeImageUpload('hero.png'),
                'button_text' => 'Read more',
                'button_url' => 'https://example.com',
                'sort_order' => '',
                'status' => 'active',
            ]);

        $response
            ->assertCreated()
            ->assertJsonPath('sort_order', 0)
            ->assertJsonPath('status', true);

        $this->assertDatabaseHas('sliders', [
            'title' => 'Hero Slide',
            'sort_order' => 0,
            'status' => 1,
        ]);
    }

    public function test_admin_gallery_creation_defaults_sort_order_and_casts_status(): void
    {
        Storage::fake('public');

        [, $token] = $this->createAuthenticatedUser();

        $response = $this
            ->withHeaders($this->apiHeaders($token))
            ->post('/api/v1/admin/galleries', [
                'type' => 'image',
                'title' => 'Community Event',
                'description' => 'Weekend outreach',
                'file_path' => $this->fakeImageUpload('gallery.png'),
                'status' => 'active',
            ]);

        $response
            ->assertCreated()
            ->assertJsonPath('sort_order', 0)
            ->assertJsonPath('status', true);

        $this->assertDatabaseHas('galleries', [
            'title' => 'Community Event',
            'type' => 'image',
            'sort_order' => 0,
            'status' => 1,
        ]);
    }

    private function createAuthenticatedUser(): array
    {
        $user = User::factory()->create();
        $token = 'plain-test-token';

        $user->forceFill([
            'api_token' => hash('sha256', $token),
        ])->save();

        return [$user, $token];
    }

    private function apiHeaders(string $token): array
    {
        return [
            'Accept' => 'application/json',
            'Authorization' => 'Bearer '.$token,
        ];
    }

    private function fakeImageUpload(string $name): UploadedFile
    {
        $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aF9sAAAAASUVORK5CYII=');

        return UploadedFile::fake()->createWithContent($name, $png);
    }
}
