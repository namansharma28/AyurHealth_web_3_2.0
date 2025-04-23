import useSound from 'use-sound';

const messageInSound = '/sounds/message-in.mp3';
const messageOutSound = '/sounds/message-out.mp3';
const typingSound = '/sounds/typing.mp3';

export const useMessageSounds = () => {
  const [playMessageIn] = useSound(messageInSound, { volume: 0.5 });
  const [playMessageOut] = useSound(messageOutSound, { volume: 0.5 });
  const [playTyping] = useSound(typingSound, { volume: 0.2 });

  return {
    playMessageIn,
    playMessageOut,
    playTyping,
  };
};