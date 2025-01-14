export async function requestNotificationPermission() {
    if (!("Notification" in window)) {
        console.error('This browser does not support notifications.');
        return;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission === 'denied') {
        return false;
    }

    try {
        const permission = await Notification.requestPermission();
        return permission === 'granted'; 
    } catch (error) {
        console.error("Error requesting notification permission:", error);
        return false;
    }
}

export async function notificationDisplay(title, description) {
    new Notification(
        title,
        {
            body: description,
            icon: '../icon.png',
            badge: '../icon.png'
        }
    );
}

export function playSound(path) {
    const audio = new Audio(path);
    audio.play().catch(error => {
        console.error(`Failed to play sound\t${error}');`);
    });
}