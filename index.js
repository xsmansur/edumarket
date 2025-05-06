const defaultCourses = [
  {
    id: 1,
    stock: 1220,
    image: "https://img-c.udemycdn.com/course/750x422/2508942_11d3_3.jpg",
    title: "Foundation",
    description:
      "Foundation to'liq kurs o'zbek tilida. HTML, CSS, JavaScript (BEM), Bootstrap, SASS (SCSS) va amaliy loyihlar barchasi bitta kurs va asosiysi mutloqo bepul. O'zingizni birinchi web saytingizni yashashingiz mumkin va uni hosting joylashni ham sizga batafsil ma'lumot beramiz.",
    price: 800000,
    count: 1,
    category: "web",
    rating: 4.7,
    reviews: 128,
    instructor: "John Smith",
    lastUpdated: "April 2023",
  },
  {
    id: 3,
    stock: 77,
    image: "https://img-c.udemycdn.com/course/750x422/1362070_b9a1_2.jpg",
    title: "React Native",
    description:
      "Learn React Native from scratch and build mobile applications for iOS and Android. This course covers all the fundamentals of React Native including components, navigation, state management, and API integration.",
    price: 900000,
    count: 1,
    category: "mobile",
    rating: 4.5,
    reviews: 89,
    instructor: "Michael Brown",
    lastUpdated: "June 2023",
  },
  {
    id: 4,
    stock: 15,
    image: "https://img-c.udemycdn.com/course/750x422/2776760_f176_10.jpg",
    title: "UI/UX Design",
    description:
      "Master the principles of UI/UX design and create beautiful, user-friendly interfaces. Learn about user research, wireframing, prototyping, and design systems. Perfect for beginners and intermediate designers.",
    price: 750000,
    count: 1,
    category: "design",
    rating: 4.8,
    reviews: 112,
    instructor: "Emma Wilson",
    lastUpdated: "July 2023",
  },
  {
    id: 5,
    stock: 42,
    image: "https://img-c.udemycdn.com/course/750x422/2394982_eaac_8.jpg",
    title: "Python for Data Science",
    description:
      "Learn Python programming for data science and machine learning. This comprehensive course covers Python basics, data manipulation with Pandas, data visualization with Matplotlib, and introduction to machine learning algorithms.",
    price: 1100000,
    count: 1,
    category: "data",
    rating: 4.6,
    reviews: 203,
    instructor: "David Lee",
    lastUpdated: "August 2023",
  },
  {
    id: 6,
    stock: 63,
    image: "https://img-c.udemycdn.com/course/750x422/1565838_e54e_16.jpg",
    title: "Flutter Development",
    description:
      "Build beautiful native apps for iOS and Android using Flutter. This course teaches you everything from Flutter basics to advanced concepts like state management, API integration, and publishing your apps to the app stores.",
    price: 850000,
    count: 1,
    category: "mobile",
    rating: 4.7,
    reviews: 156,
    instructor: "Jessica Chen",
    lastUpdated: "September 2023",
  },
];

// Initialize state
const courses = JSON.parse(localStorage.getItem("courses")) || defaultCourses;
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentFilter = "all";
let darkMode = localStorage.getItem("darkMode") === "true";

// DOM Elements
const courseContainer = document.getElementById("courseContainer");
const cartModal = document.getElementById("cartModal");
const cartBtn = document.getElementById("cartBtn");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const checkoutBtn = document.getElementById("checkoutBtn");
const addCourseBtn = document.getElementById("addCourseBtn");
const addCourseModal = document.getElementById("addCourseModal");
const closeAddCourse = document.getElementById("closeAddCourse");
const addCourseForm = document.getElementById("addCourseForm");
const courseDetailModal = document.getElementById("courseDetailModal");
const courseDetailContent = document.getElementById("courseDetailContent");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const toggleTheme = document.getElementById("toggleTheme");
const searchInput = document.getElementById("searchInput");
const categoryFilters = document.querySelectorAll(".category-btn");

// Save data to localStorage
function saveCourses() {
  localStorage.setItem("courses", JSON.stringify(courses));
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Cart functions
function addToCart(id) {
  const course = courses.find((c) => c.id === id);
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    if (existingItem.count < course.stock) {
      existingItem.count++;
      showToast("Item quantity increased");
    } else {
      showToast("Maximum stock reached", "error");
    }
  } else if (course.stock > 0) {
    cart.push({ ...course, count: 1 });
    showToast("Item added to cart");
    document.getElementById("cartCount").classList.add("pulse");
    setTimeout(() => {
      document.getElementById("cartCount").classList.remove("pulse");
    }, 500);
  } else {
    showToast("Item out of stock", "error");
  }

  saveCart();
  renderCart();
  renderCourses();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  renderCart();
  renderCourses();
  showToast("Item removed from cart");
}

function incrementCartItem(id) {
  const item = cart.find((item) => item.id === id);
  const course = courses.find((c) => c.id === id);

  if (item && item.count < course.stock) {
    item.count++;
    saveCart();
    renderCart();
    renderCourses();
    showToast("Item quantity increased");
  } else {
    showToast("Maximum stock reached", "error");
  }
}

function decrementCartItem(id) {
  const item = cart.find((item) => item.id === id);

  if (item) {
    if (item.count > 1) {
      item.count--;
      saveCart();
      renderCart();
      renderCourses();
      showToast("Item quantity decreased");
    } else {
      removeFromCart(id);
    }
  }
}

function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.count, 0);
  cartCount.textContent = count;
}

function calculateCartTotal() {
  return cart.reduce((total, item) => total + item.price * item.count, 0);
}

// Render functions
function renderCourses() {
  courseContainer.innerHTML = "";

  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      currentFilter === "all" || course.category === currentFilter;
    const matchesSearch =
      course.title.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      course.description
        .toLowerCase()
        .includes(searchInput.value.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filteredCourses.length === 0) {
    courseContainer.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <i class="fas fa-search text-5xl mb-4"></i>
        <h3 class="text-xl font-medium mb-2">No courses found</h3>
        <p>Try adjusting your search or filter criteria</p>
      </div>
    `;
    return;
  }

  filteredCourses.forEach((course) => {
    const isInCart = cart.find((item) => item.id === course.id);
    const stockStatus =
      course.stock > 0
        ? `<span class="text-green-600 dark:text-green-400 font-medium">${course.stock} available</span>`
        : `<span class="text-red-600 dark:text-red-400 font-medium">Out of stock</span>`;

    const stars = generateStarRating(course.rating);

    courseContainer.innerHTML += `
      <div class="course-card bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div class="relative overflow-hidden h-48">
          <img src="${course.image}" alt="${
      course.title
    }" class="course-image w-full h-full object-cover">
          <div class="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
            <button onclick="showCourseDetails(${
              course.id
            })" class="bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-lg font-medium">
              <i class="fas fa-eye mr-2"></i>View Details
            </button>
          </div>
          <div class="absolute top-2 right-2 bg-white dark:bg-gray-800 text-primary-600 px-2 py-1 rounded-lg text-sm font-bold">
            ${formatPrice(course.price)} so'm
          </div>
        </div>
        <div class="p-5">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-bold text-gray-800 dark:text-white">${
              course.title
            }</h3>
            <span class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-full">
              ${getCategoryName(course.category)}
            </span>
          </div>
          <div class="flex items-center mb-2">
            ${stars}
            <span class="text-gray-600 dark:text-gray-400 text-sm ml-1">(${
              course.reviews
            })</span>
          </div>
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">${
            course.description
          }</p>
          <div class="flex justify-between items-center">
            <div class="text-sm">${stockStatus}</div>
            ${
              isInCart
                ? `<div class="flex items-center">
                  <button onclick="decrementCartItem(${course.id})" class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white w-8 h-8 rounded-l-lg flex items-center justify-center">
                    <i class="fas fa-minus"></i>
                  </button>
                  <span class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white px-3 py-1">${isInCart.count}</span>
                  <button onclick="incrementCartItem(${course.id})" class="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white w-8 h-8 rounded-r-lg flex items-center justify-center">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>`
                : `<button onclick="addToCart(${
                    course.id
                  })" class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium ${
                    course.stock <= 0 ? "opacity-50 cursor-not-allowed" : ""
                  }" ${course.stock <= 0 ? "disabled" : ""}>
                  <i class="fas fa-shopping-cart mr-2"></i>Add to Cart
                </button>`
            }
          </div>
        </div>
      </div>
    `;
  });
}

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
        <i class="fas fa-shopping-cart text-5xl mb-4"></i>
        <h3 class="text-xl font-medium mb-2">Your cart is empty</h3>
        <p>Add some courses to get started</p>
      </div>
    `;
    cartTotal.textContent = "0 so'm";
    checkoutBtn.disabled = true;
    checkoutBtn.classList.add("opacity-50", "cursor-not-allowed");
  } else {
    cartItems.innerHTML = "";
    cart.forEach((item) => {
      cartItems.innerHTML += `
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div class="flex gap-3">
            <img src="${item.image}" alt="${
        item.title
      }" class="w-20 h-20 object-cover rounded-lg">
            <div class="flex-1">
              <h4 class="font-medium text-gray-800 dark:text-white">${
                item.title
              }</h4>
              <div class="flex justify-between items-center mt-2">
                <div class="flex items-center">
                  <button onclick="decrementCartItem(${
                    item.id
                  })" class="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white w-7 h-7 rounded-l-md flex items-center justify-center">
                    <i class="fas fa-minus text-xs"></i>
                  </button>
                  <span class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white px-3 py-1 text-sm">${
                    item.count
                  }</span>
                  <button onclick="incrementCartItem(${
                    item.id
                  })" class="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white w-7 h-7 rounded-r-md flex items-center justify-center">
                    <i class="fas fa-plus text-xs"></i>
                  </button>
                </div>
                <div class="text-right">
                  <div class="text-primary-600 font-medium">${formatPrice(
                    item.price * item.count
                  )} so'm</div>
                  <button onclick="removeFromCart(${
                    item.id
                  })" class="text-red-500 hover:text-red-700 text-sm">
                    <i class="fas fa-trash mr-1"></i>Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    cartTotal.textContent = `${formatPrice(calculateCartTotal())} so'm`;
    checkoutBtn.disabled = false;
    checkoutBtn.classList.remove("opacity-50", "cursor-not-allowed");
  }
}

function showCourseDetails(id) {
  const course = courses.find((c) => c.id === id);
  if (!course) return;

  const stars = generateStarRating(course.rating);
  const isInCart = cart.find((item) => item.id === id);

  courseDetailContent.innerHTML = `
    <div class="flex justify-between items-start mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white">${
        course.title
      }</h2>
      <button id="closeCourseDetail" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
        <i class="fas fa-times text-xl"></i>
      </button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <img src="${course.image}" alt="${
    course.title
  }" class="w-full h-64 object-cover rounded-lg mb-4">
        <div class="flex items-center mb-2">
          ${stars}
          <span class="text-gray-600 dark:text-gray-400 text-sm ml-1">(${
            course.reviews
          } reviews)</span>
        </div>
        <div class="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-4">
          <i class="fas fa-user-tie mr-2"></i>
          <span>Instructor: ${course.instructor}</span>
        </div>
        <div class="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-4">
          <i class="fas fa-calendar-alt mr-2"></i>
          <span>Last updated: ${course.lastUpdated}</span>
        </div>
        <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
          <div class="flex justify-between items-center">
            <div>
              <div class="text-2xl font-bold text-primary-600">${formatPrice(
                course.price
              )} so'm</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                ${
                  course.stock > 0
                    ? `${course.stock} spots remaining`
                    : "Out of stock"
                }
              </div>
            </div>
            ${
              isInCart
                ? `<div class="flex items-center">
                  <button onclick="decrementCartItem(${course.id})" class="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white w-8 h-8 rounded-l-lg flex items-center justify-center">
                    <i class="fas fa-minus"></i>
                  </button>
                  <span class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-1">${isInCart.count}</span>
                  <button onclick="incrementCartItem(${course.id})" class="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white w-8 h-8 rounded-r-lg flex items-center justify-center">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>`
                : `<button onclick="addToCart(${
                    course.id
                  })" class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium ${
                    course.stock <= 0 ? "opacity-50 cursor-not-allowed" : ""
                  }" ${course.stock <= 0 ? "disabled" : ""}>
                  <i class="fas fa-shopping-cart mr-2"></i>Add to Cart
                </button>`
            }
          </div>
        </div>
      </div>
      
      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Course Description</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">${
          course.description
        }</p>
        
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">What You'll Learn</h3>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-400 mb-6">
          <li>Comprehensive understanding of ${course.title}</li>
          <li>Practical skills through hands-on projects</li>
          <li>Industry best practices and techniques</li>
          <li>Problem-solving and critical thinking skills</li>
        </ul>
        
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-3">Requirements</h3>
        <ul class="list-disc list-inside text-gray-600 dark:text-gray-400">
          <li>Basic computer knowledge</li>
          <li>No prior experience required - beginners welcome!</li>
          <li>Dedication and willingness to learn</li>
        </ul>
      </div>
    </div>
  `;

  courseDetailModal.classList.remove("hidden");

  document.getElementById("closeCourseDetail").addEventListener("click", () => {
    courseDetailModal.classList.add("hidden");
  });
}

// Helper functions
function formatPrice(price) {
  return price.toLocaleString();
}

function generateStarRating(rating) {
  let stars = "";
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars += '<i class="fas fa-star text-yellow-400"></i>';
    } else if (i === fullStars + 1 && halfStar) {
      stars += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
    } else {
      stars += '<i class="far fa-star text-yellow-400"></i>';
    }
  }

  return stars;
}

function getCategoryName(category) {
  const categories = {
    web: "Web Dev",
    mobile: "Mobile Dev",
    design: "Design",
    data: "Data Science",
  };
  return categories[category] || category;
}

function showToast(message, type = "success") {
  toastMessage.textContent = message;
  toast.className = toast.className.replace(/bg-\w+-\d+/g, "");

  if (type === "success") {
    toast.classList.add("bg-green-500");
  } else if (type === "error") {
    toast.classList.add("bg-red-500");
  } else if (type === "info") {
    toast.classList.add("bg-blue-500");
  }

  toast.classList.remove("translate-y-24");

  setTimeout(() => {
    toast.classList.add("translate-y-24");
  }, 3000);
}

function toggleDarkModeClass() {
  if (darkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  localStorage.setItem("darkMode", darkMode);
}

// Event listeners
cartBtn.addEventListener("click", () => {
  cartModal.classList.toggle("translate-x-full");
});

closeCart.addEventListener("click", () => {
  cartModal.classList.add("translate-x-full");
});

addCourseBtn.addEventListener("click", () => {
  addCourseModal.classList.remove("hidden");
});

closeAddCourse.addEventListener("click", () => {
  addCourseModal.classList.add("hidden");
});

addCourseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newCourse = {
    id: Date.now(),
    title: document.getElementById("courseTitle").value,
    description: document.getElementById("courseDescription").value,
    price: Number.parseInt(document.getElementById("coursePrice").value),
    stock: Number.parseInt(document.getElementById("courseStock").value),
    image: document.getElementById("courseImage").value,
    category: document.getElementById("courseCategory").value,
    count: 1,
    rating: 5.0,
    reviews: 0,
    instructor: "You",
    lastUpdated: new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
  };

  courses.unshift(newCourse);
  saveCourses();
  renderCourses();

  addCourseForm.reset();
  addCourseModal.classList.add("hidden");
  showToast("Course added successfully");
});

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) return;

  // Update stock
  cart.forEach((item) => {
    const course = courses.find((c) => c.id === item.id);
    if (course) {
      course.stock -= item.count;
    }
  });

  saveCourses();
  cart = [];
  saveCart();
  renderCourses();
  renderCart();

  cartModal.classList.add("translate-x-full");
  showToast("Checkout successful! Thank you for your purchase.");
});

toggleTheme.addEventListener("click", () => {
  darkMode = !darkMode;
  toggleDarkModeClass();
});

searchInput.addEventListener("input", () => {
  renderCourses();
});

// Category filter
categoryFilters.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryFilters.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.category;
    renderCourses();
  });
});

// Close modals when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === addCourseModal) {
    addCourseModal.classList.add("hidden");
  }
  if (e.target === courseDetailModal) {
    courseDetailModal.classList.add("hidden");
  }
});

// Initialize
toggleDarkModeClass();
updateCartCount();
renderCourses();
renderCart();
