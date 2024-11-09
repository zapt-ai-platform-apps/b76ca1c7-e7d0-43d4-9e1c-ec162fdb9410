import { createSignal, onMount, createEffect, For, Show } from 'solid-js';
import { createEvent, supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';

function App() {
  const [prompts, setPrompts] = createSignal([]);
  const [newPrompt, setNewPrompt] = createSignal('');
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [loading, setLoading] = createSignal(false);
  const [generatedImages, setGeneratedImages] = createSignal({});
  
  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const authListener = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('homePage');
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });

    return () => {
      authListener.data.unsubscribe();
    };
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
  };

  const fetchPrompts = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch('/api/getPrompts', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      setPrompts(data);
    } else {
      console.error('Error fetching prompts:', response.statusText);
    }
  };

  const savePrompt = async (e) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    try {
      const response = await fetch('/api/savePrompt', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: newPrompt() }),
      });
      if (response.ok) {
        const savedPrompt = await response.json();
        setPrompts([...prompts(), savedPrompt]);
        setNewPrompt('');
      } else {
        console.error('Error saving prompt');
      }
    } catch (error) {
      console.error('Error saving prompt:', error);
    }
  };

  createEffect(() => {
    if (!user()) return;
    fetchPrompts();
  });

  const generateImage = async (promptId, promptText) => {
    setLoading(true);
    try {
      const result = await createEvent('generate_image', {
        prompt: promptText
      });
      setGeneratedImages({
        ...generatedImages(),
        [promptId]: result
      });
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

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 class="text-2xl font-bold mb-4 text-green-600">Create New Prompt</h2>
              <form onSubmit={savePrompt} class="space-y-4">
                <input
                  type="text"
                  placeholder="Enter your creative prompt"
                  value={newPrompt()}
                  onInput={(e) => setNewPrompt(e.target.value)}
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent box-border"
                  required
                />
                <button
                  type="submit"
                  class="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                >
                  Save Prompt
                </button>
              </form>
            </div>

            <div>
              <h2 class="text-2xl font-bold mb-4 text-green-600">Your Prompts</h2>
              <div class="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-4">
                <For each={prompts()}>
                  {(prompt) => (
                    <div class="bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                      <p class="font-semibold text-lg text-green-600 mb-2">{prompt.prompt}</p>
                      <div class="flex space-x-4">
                        <button
                          class={`flex-1 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => generateImage(prompt.id, prompt.prompt)}
                          disabled={loading()}
                        >
                          <Show when={loading() && !generatedImages()[prompt.id]}>Generating...</Show>
                          <Show when={!loading() || generatedImages()[prompt.id]}>Generate Image</Show>
                        </button>
                      </div>
                      <Show when={generatedImages()[prompt.id]}>
                        <div class="mt-4">
                          <img src={generatedImages()[prompt.id]} alt="Generated" class="w-full rounded-lg shadow-md" />
                        </div>
                      </Show>
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