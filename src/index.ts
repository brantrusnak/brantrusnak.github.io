const main = document.querySelector('main');
const nav = document.querySelector('nav');
const navTitle = document.querySelector('div.nav-title');
const sections = document.querySelectorAll('section');
const tags = document.querySelectorAll('a.nav-item');
let navTitleStatus = false;
let navStatus = false;
let targetSection: HTMLElement;
let currentSection = sections.item(0);
let activeTag: HTMLElement;
let sectionMap = new Map();

declare const emailjs: any;

let emailInformation = {
    name: '',
    email: '',
    message: ''
}

tags.forEach(tag => {
    sections.forEach(section => {
        if(section.id === tag.getAttribute('data-nav-id')) {
            sectionMap.set(section.id, {section, tag});
        }
    });
});

function toggleNav(){
    // window size check, dont apply styles if large enough for laptop
    if(window.innerWidth < 992) {
        navStatus = !navStatus;
        navStatus ? nav.classList.add('open') : nav.classList.remove('open');
    }
}

function navigateTo(event: Event) {
    event.preventDefault();
    sections.forEach(section => {
        if(section.id === event.srcElement.getAttribute('data-nav-id')) {
            section.scrollIntoView({behavior: 'smooth', block: 'start'});
            targetSection = section;
        }
    });
}

main.addEventListener("scroll", event => {
    Array.from(sections).filter(section => {
        if(currentSection.id === section.id || (targetSection && section.id !== targetSection.id) ) {return}
        if(
            section.offsetTop <= Math.floor(main.scrollTop + 32) &&
            section.offsetTop + section.offsetHeight > Math.floor(main.scrollTop + 32)
        ) {
            currentSection = section;
            
            if(section.id === 'about') {
                navTitle.classList.remove('type');
                navTitle.classList.add('erase');

                setTimeout(() => {
                    navTitle.classList.remove('erase');
                }, 2250);

                navTitleStatus = false;
            } else {
                if(!navTitleStatus) {
                    navTitleStatus = true;
                }
                navTitle.classList.remove('erase');
                navTitle.classList.add('type');
            }
            if(targetSection) {
                targetSection = null;
            }
            setActive();
        }
    });
});

function handleChange(event: Event) {
    let input = event.target as HTMLInputElement;
    emailInformation = {
        ...emailInformation,
        [input.name]: input.value
    }
}

function handleSubmit(event: Event) {
    let form = event.target as HTMLFormElement;
    let notification = document.createElement('div');
    notification.classList.add('notification');
    document.body.append(notification);

    event.preventDefault();

    emailjs.send('default_service', 'template_EcqUsnlm', emailInformation).then((response: Response) => {
        form.reset();
        notification.classList.add('success');
        notification.innerText = 'Sent email';
        
        setTimeout(() => {
            notification.classList.add('slide-in');
            setTimeout(() => {
                notification.classList.remove('slide-in');
                notification.classList.add('slide-out');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 500);
            }, 3000);
        }, 100);


    }).catch((error: Error) => {
        notification.classList.add('error');
        notification.innerText = 'Failed to send';

        setTimeout(() => {
            notification.classList.add('slide-in');
            setTimeout(() => {
                notification.classList.remove('slide-in');
                notification.classList.add('slide-out');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 500);
            }, 3000);
        }, 100);


    });
}

function setActive() {
    if (activeTag) {
        activeTag.classList.remove("active");
    }
    activeTag = sectionMap.get(currentSection.id).tag;
    activeTag.classList.add("active");
}

setActive();