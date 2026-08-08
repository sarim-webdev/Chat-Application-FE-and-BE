let ringtone = null;

export const playRingtone = async () => {
  try {
    if (!ringtone) {
      ringtone = new Audio("/sounds/ringtone.mp3");

      ringtone.loop = true;

      ringtone.volume = 1;
    }

    ringtone.currentTime = 0;

    await ringtone.play();
  } catch (error) {
    console.log(error);
  }
};

export const stopRingtone = () => {
  if (!ringtone) return;

  ringtone.pause();

  ringtone.currentTime = 0;
};

let callingTone = null;

export const playCallingTone = async () => {
  try {
    if (!callingTone) {
      callingTone = new Audio("/sounds/calling.mp3");

      callingTone.loop = true;

      callingTone.volume = 1;
    }

    callingTone.currentTime = 0;

    await callingTone.play();
  } catch (error) {
    console.log(error);
  }
};

export const stopCallingTone = () => {
  if (!callingTone) return;

  callingTone.pause();

  callingTone.currentTime = 0;
};

export const playEndCallSound = async () => {
  try {
    const endTone = new Audio("/sounds/end-call.mp3");

    endTone.volume = 1;

    await endTone.play();
  } catch (error) {
    console.log(error);
  }
};
