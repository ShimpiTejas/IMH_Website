
      // Three.js Initialization
      const initWebGL = () => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );
        const renderer = new THREE.WebGLRenderer({
          alpha: false,
          antialias: true,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document
          .getElementById("webgl-background")
          .appendChild(renderer.domElement);

        // Particle system
        const particles = new THREE.BufferGeometry();
        const particleCount = 5000;
        const posArray = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i++) {
          posArray[i] = (Math.random() - 0.5) * 10;
        }

        particles.setAttribute(
          "position",
          new THREE.BufferAttribute(posArray, 3)
        );
        const material = new THREE.PointsMaterial({
          size: 0.005,
          color: new THREE.Color("#7C3AED"),
          transparent: true,
        });

        const particleMesh = new THREE.Points(particles, material);
        scene.add(particleMesh);
        camera.position.z = 5;

        function animate() {
          requestAnimationFrame(animate);
          particleMesh.rotation.y += 0.001;
          particleMesh.rotation.x += 0.001;
          renderer.render(scene, camera);
        }
        animate();
      };

      // Initialize WebGL
      window.addEventListener("load", () => {
        initWebGL();
        document.getElementById("loader").style.opacity = "0";
        setTimeout(() => {
          document.getElementById("loader").style.display = "none";
        }, 500);
      });

      // Mobile Menu
      const menuToggle = document.getElementById("menu-toggle");
      const mobileMenu = document.getElementById("mobile-menu");

      menuToggle.addEventListener("click", () => {
        mobileMenu.classList.toggle("translate-x-full");
      });

      // Close menu on outside click
      document.addEventListener("click", (e) => {
        if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
          mobileMenu.classList.add("translate-x-full");
        }
      });

      // Intersection Observer for animations
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-fadeInUp");
            }
          });
        },
        { threshold: 0.1 }
      );

      document
        .querySelectorAll(".service-card, .portfolio-item")
        .forEach((el) => observer.observe(el));

      // WEBGL LOGO

      //   CURSOR

      const cursor = document.createElement("div");
      cursor.className = "premium-cursor";
      cursor.innerHTML = `
    <div class="cursor-core"></div>
    <div class="cursor-trail"></div>
    ${Array(6)
      .fill()
      .map(() => `<div class="cursor-particle"></div>`)
      .join("")}
`;
      document.body.appendChild(cursor);

      let mouseX = 0,
        mouseY = 0;
      let cursorX = 0,
        cursorY = 0;
      const speed = 0.18;
      const particles = Array.from(cursor.children).slice(2);

      function updateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;

        cursorX += dx * speed;
        cursorY += dy * speed;

        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        // Update particles
        particles.forEach((p, i) => {
          const angle = (i * 60 + performance.now() * 0.02) % 360;
          const radius = Math.sin(performance.now() * 0.002 + i) * 10 + 15;
          p.style.transform = `rotate(${angle}deg) translate(${radius}px)`;
        });

        requestAnimationFrame(updateCursor);
      }

      document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      // Hover interactions
      document.querySelectorAll("a, button, [data-hover]").forEach((el) => {
        el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
        el.addEventListener("mouseleave", () =>
          cursor.classList.remove("hover")
        );
      });

      updateCursor();

      // In your WebGL animation loop:
      uniforms.uCursorPos.value.set(
        (cursorX / window.innerWidth) * 2 - 1,
        -(cursorY / window.innerHeight) * 2 + 1
      );

      function createCursorParticles() {
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.PointsMaterial({
          size: 0.1,
          color: new THREE.Color(0.5, 0.5, 1),
          transparent: true,
        });

        const positions = new Float32Array(100 * 3);
        const particles = new THREE.Points(geometry, material);

        function update() {
          // Update particle positions based on cursor movement
          positions.forEach((_, i) => {
            positions[i * 3] =
              cursorX + (Math.sin(Date.now() * 0.001 + i) * i) / 10;
            positions[i * 3 + 1] =
              cursorY + (Math.cos(Date.now() * 0.001 + i) * i) / 10;
          });
          geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
          );
        }

        return { particles, update };
      }
    