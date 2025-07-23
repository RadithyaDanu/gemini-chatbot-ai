const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  // Tampilkan pesan "thinking" yang akan diperbarui nanti
  const thinkingMsgElement = appendMessage('bot', 'Gemini is thinking...');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userMessage: userMessage }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.reply || 'Network response was not ok');
    }

    const data = await response.json();
    // Perbarui pesan "thinking..." dengan balasan dari bot
    thinkingMsgElement.textContent = data.reply;
  } catch (error) {
    console.error('Error:', error);
    // Perbarui pesan "thinking..." dengan pesan error
    thinkingMsgElement.textContent = 'Sorry, something went wrong. Please try again.';
  } finally {
    // Scroll ke bawah untuk menampilkan pesan baru
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg; // Kembalikan elemen pesan
}
