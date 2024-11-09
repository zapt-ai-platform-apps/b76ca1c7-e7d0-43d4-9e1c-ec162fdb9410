import { createSignal, onMount, createEffect, For, Show } from 'solid-js';
import { createEvent, supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';

function App() {
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [loading, setLoading] = createSignal(false);
  const [generatedImages, setGeneratedImages] = createSignal([]);
  const [textInput, setTextInput] = createSignal('');

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('homePage');
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });

    return () => {
      authListener.unsubscribe();
    };
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
  };

  const fetchGeneratedImages = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/getPrompts', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setGeneratedImages(data);
      } else {
        console.error('Error fetching images:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  createEffect(() => {
    if (user()) {
      fetchGeneratedImages();
    }
  });

  const generateImage = async () => {
    if (!textInput()) return;
    setLoading(true);
    try {
      const imageUrl = await createEvent('generate_image', {
        prompt: textInput()
      });

      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/savePrompt', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: textInput(), imageUrl })
      });
      if (response.ok) {
        const savedPrompt = await response.json();
        setGeneratedImages([savedPrompt, ...generatedImages()]);
        setTextInput('');
      } else {
        console.error('Error saving image:', response.statusText);
      }

    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4 text-gray-800">
      <Show
        when={currentPage() === 'homePage'}
        fallback={
          <div class="flex items-center justify-center min-h-screen">
            <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
              <h2 class="text-3xl font-bold mb-6 text-green-600">Sign in with ZAPT</h2>
              <a
                href="https://www.zapt.ai"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-500 hover:underline mb-6 block text-center"
              >
                Learn more about ZAPT
              </a>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google', 'facebook', 'apple']}
                magicLink={true}
                view="magic_link"
                showLinks={false}
                authView="magic_link"
              />
            </div>
          </div>
        }
      >
        <div class="max-w-6xl mx-auto h-full">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-4xl font-bold text-green-600">New App</h1>
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>

          <div class="grid grid-cols-1 gap-8">
            <div>
              <h2 class="text-2xl font-bold mb-4 text-green-600">Generate Image from Text</h2>
              <div class="space-y-4">
                <input
                  type="text"
                  placeholder="Enter text to generate image"
                  value={textInput()}
                  onInput={(e) => setTextInput(e.target.value)}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent box-border"
                  disabled={loading()}
                />
                <button
                  onClick={generateImage}
                  class={`w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() || !textInput() ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading() || !textInput()}
                >
                  <Show when={loading()}>
                    Generating...
                  </Show>
                  <Show when={!loading()}>
                    Generate Image
                  </Show>
                </button>
              </div>
            </div>

            <div>
              <h2 class="text-2xl font-bold mb-4 text-green-600">Generated Images</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto" style="max-height: calc(100vh - 300px);">
                <For each={generatedImages()}>
                  {(item) => (
                    <div class="bg-white p-4 rounded-lg shadow-md">
                      <p class="text-sm text-gray-600 mb-2">{item.prompt}</p>
                      <img src={item.imageUrl} alt="Generated" class="w-full h-48 object-cover rounded-md" />
                    </div>
                  )}
                </For>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}

export default App;