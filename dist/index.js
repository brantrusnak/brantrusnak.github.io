var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var main = document.querySelector('main');
var nav = document.querySelector('nav');
var navTitle = document.querySelector('div.nav-title');
var sections = document.querySelectorAll('section');
var tags = document.querySelectorAll('a.nav-item');
var navTitleStatus = false;
var navStatus = false;
var targetSection;
var currentSection = sections.item(0);
var activeTag;
var sectionMap = new Map();
var emailInformation = {
    name: '',
    email: '',
    message: ''
};
tags.forEach(function (tag) {
    sections.forEach(function (section) {
        if (section.id === tag.getAttribute('data-nav-id')) {
            sectionMap.set(section.id, { section: section, tag: tag });
        }
    });
});
function toggleNav() {
    if (window.innerWidth < 992) {
        navStatus = !navStatus;
        navStatus ? nav.classList.add('open') : nav.classList.remove('open');
    }
}
function navigateTo(event) {
    event.preventDefault();
    sections.forEach(function (section) {
        if (section.id === event.srcElement.getAttribute('data-nav-id')) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            targetSection = section;
        }
    });
}
main.addEventListener("scroll", function (event) {
    Array.from(sections).filter(function (section) {
        if (currentSection.id === section.id || (targetSection && section.id !== targetSection.id)) {
            return;
        }
        if (section.offsetTop <= Math.floor(main.scrollTop + 32) &&
            section.offsetTop + section.offsetHeight > Math.floor(main.scrollTop + 32)) {
            currentSection = section;
            if (section.id === 'about') {
                navTitle.classList.remove('type');
                navTitle.classList.add('erase');
                setTimeout(function () {
                    navTitle.classList.remove('erase');
                }, 2250);
                navTitleStatus = false;
            }
            else {
                if (!navTitleStatus) {
                    navTitleStatus = true;
                }
                navTitle.classList.remove('erase');
                navTitle.classList.add('type');
            }
            if (targetSection) {
                targetSection = null;
            }
            setActive();
        }
    });
});
function handleChange(event) {
    var _a;
    var input = event.target;
    emailInformation = __assign({}, emailInformation, (_a = {}, _a[input.name] = input.value, _a));
}
function handleSubmit(event) {
    var form = event.target;
    var notification = document.createElement('div');
    notification.classList.add('notification');
    document.body.append(notification);
    event.preventDefault();
    emailjs.send('default_service', 'template_EcqUsnlm', emailInformation).then(function (response) {
        form.reset();
        notification.classList.add('success');
        notification.innerText = 'Sent email';
        setTimeout(function () {
            notification.classList.add('slide-in');
            setTimeout(function () {
                notification.classList.remove('slide-in');
                notification.classList.add('slide-out');
                setTimeout(function () {
                    document.body.removeChild(notification);
                }, 500);
            }, 3000);
        }, 100);
    })["catch"](function (error) {
        notification.classList.add('error');
        notification.innerText = 'Failed to send';
        setTimeout(function () {
            notification.classList.add('slide-in');
            setTimeout(function () {
                notification.classList.remove('slide-in');
                notification.classList.add('slide-out');
                setTimeout(function () {
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
