function breakTheText() {
    var h1 = document.querySelector("h1");
    var h1Text = h1.textContent;
    var split = h1Text.split("");
    var clutter = "";
    var halfvalue = split.length / 2;

    // Split text into spans - first half gets "half" class, second half gets "full" class
    split.forEach(function (elem, idx) {
        if (idx < halfvalue) {
            clutter += `<span class="half">${elem}</span>`;
        } else {
            clutter += `<span class="full">${elem}</span>`;
        }
    });
    h1.innerHTML = clutter;
}

breakTheText();

// GSAP Animation for first half of text
gsap.from("h1 .half", {
    y: 50,
    opacity: 0,
    duration: 0.6,
    delay: 0.5,
    stagger: 0.15
    // Positive stagger: animates from left to right
});

// GSAP Animation for second half of text
gsap.from("h1 .full", {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.5,
    stagger: -0.15
    // Negative stagger: animates from right to left
});
