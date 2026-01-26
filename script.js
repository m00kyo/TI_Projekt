const pickers = document.querySelectorAll('.pickers input[type="color"]');
const colors = ["#fde7fa", "#91185c", "#db0071"];

function updateColors() {
  const body = document.querySelector("body");

  body.style.setProperty("--sixty", colors[0]);
  body.style.setProperty("--thrity", colors[1]);
  body.style.setProperty("--ten", colors[2]);
}

pickers.forEach((picker, index) => {
  picker.addEventListener("input", () => {
    colors[index] = picker.value;
    updateColors();
    checkContrast();
  });
});

const burger = document.querySelector(".burger");
const mobileMenu = document.querySelector(".mobile-menu");

burger.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");

  if (mobileMenu.classList.contains("active")) {
    document.body.style.overflowY = "hidden";
  }

  const menuOptions = mobileMenu.querySelectorAll("a");
  menuOptions.forEach((option) => {
    option.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      document.body.style.overflowY = "auto";
    });
  });
});

function getLuminance(r, g, b) {
  let [R, G, B] = [r, g, b].map((val) => {
    val /= 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function getContrastRatio(rgb1, rgb2) {
  const lum1 = getLuminance(...rgb1);
  const lum2 = getLuminance(...rgb2);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

function checkContrast() {
  const rgb1 = hexToRgb(colors[0]);
  const rgb2 = hexToRgb(colors[1]);
  const rgb3 = hexToRgb(colors[2]);
  const contrastRatio30 = getContrastRatio(rgb1, rgb2);
  const contrastRatio10 = getContrastRatio(rgb1, rgb3);

  if (contrastRatio30 < 4.5) {
    document.querySelector(".picker30 .emoji.sad").style.display = "block";
    document.querySelector(".picker30 .emoji.happy").style.display = "none";
  } else {
    document.querySelector(".picker30 .emoji.sad").style.display = "none";
    document.querySelector(".picker30 .emoji.happy").style.display = "block";
  }

  if (contrastRatio10 < 3.0) {
    document.querySelector(".picker10 .emoji.sad").style.display = "block";
    document.querySelector(".picker10 .emoji.happy").style.display = "none";
  } else {
    document.querySelector(".picker10 .emoji.sad").style.display = "none";
    document.querySelector(".picker10 .emoji.happy").style.display = "block";
  }
}

function hexToRgb(hex) {
  hex = hex.replace(/^#/, "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return [r, g, b];
}
