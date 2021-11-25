import sampleSound from './sounds/ding2_mild_V1.ogg'

export const AvatarStyle = ["user-profile__image--red", "user-profile__image--green", " "]
export const ChatTextStyle = ["chat-user-title--red", "chat-user-title--green", " "]
export const UserIconStyle = ["user-icon2", "user-icon3", " "]
export const LOREM_TEXT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip."


export function getInitals(name) {
    let result = ""
    let nameArr = name.trim().split(" ")
    if (nameArr.length > 0) {
        nameArr.forEach(element => {
            result += element[0]
        });
    } else {
        result = name[0]
    }
    return result.toUpperCase()
}

export const sortObjectArray = (arr, key) => {
    const sorter = (a, b) => {
        return b[key] - a[key]
    }
    arr.sort(sorter);
};

export const EMOJIS = ["👍", "👏", "🙂", "😀", "😎", "😍"]

export const AudioClips = {
    SampleSound1: sampleSound
}
window.testAudio = () => {
    fireAudioClop(AudioClips.SampleSound1)
}
export const fireAudioClop = (clip) => {
    let audio = new Audio(clip)
    audio.volume = 0.2
    audio.play();
}