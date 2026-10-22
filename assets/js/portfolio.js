document.addEventListener("DOMContentLoaded", function () {
  const portfolioContainer = document.getElementById("portfolio-container");
  const filterButtons = document.querySelectorAll(".filter-btn");

  // =========================
  // JSON FILES
  // =========================

  const categories = [
    "website",
    "video",
    "photography",
    "branding",
    "graphic",
    "3d",
  ];

  let allProjects = [];

  // =========================
  // LOAD PROJECTS
  // =========================

  async function loadProjects() {
    allProjects = [];

    for (const category of categories) {
      try {
        const response = await fetch(`./data/${category}.json`);

        if (!response.ok) {
          throw new Error(`${category}.json tidak ditemukan`);
        }

        const projects = await response.json();

        // Pastikan JSON berbentuk array
        if (!Array.isArray(projects)) {
          console.error(`${category}.json harus berupa array`);

          continue;
        }

        // Tambahkan category ke setiap project
        projects.forEach((project) => {
          // Keep draft entries in JSON, but do not render them publicly.
          if (project.hidden === true) {
            return;
          }

          project.categoryKey = category;
          allProjects.push(project);
        });

        console.log(`${category}.json berhasil:`, projects.length, "project");
      } catch (error) {
        console.warn(`Tidak bisa membaca ${category}.json:`, error.message);
      }
    }

    console.log("TOTAL PROJECT:", allProjects.length);

    displayProjects(allProjects);
  }

  // =========================
  // DISPLAY PROJECTS
  // =========================

  function displayProjects(projects) {
    portfolioContainer.innerHTML = "";

    if (!projects || projects.length === 0) {
      portfolioContainer.innerHTML = `
        <div class="col-12">
          <p>No projects found.</p>
        </div>
      `;

      return;
    }

    projects.forEach((project) => {
      const projectHTML = `

        <div
          class="col-lg-4 col-md-6 portfolio-item"
          data-category="${project.categoryKey}"
        >

          <div class="st-portfolio-single st-style1">

            <div class="st-portfolio-item">

              <a
                href="${project.page}"
                class="st-portfolio st-zoom"
              >

                <div class="st-portfolio-img st-zoom-in">

                  <img
                    src="${project.thumbnail}"
                    alt="${project.title}"
                  />

                </div>


                <div class="st-portfolio-item-hover">

                  <i class="fas fa-arrow-right"></i>

                  <h5>
                    ${project.title}
                  </h5>

                  <p>
                    ${project.category}
                  </p>

                </div>

              </a>

            </div>

          </div>

        </div>

      `;

      portfolioContainer.insertAdjacentHTML("beforeend", projectHTML);
    });
  }

  // =========================
  // FILTER
  // =========================

  filterButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();

      const filter = this.dataset.filter;

      // Active button
      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
      });

      this.classList.add("active");

      // All Projects
      if (filter === "all") {
        displayProjects(allProjects);

        return;
      }

      // Filter berdasarkan nama file JSON
      const filteredProjects = allProjects.filter(
        (project) => project.categoryKey === filter,
      );

      displayProjects(filteredProjects);
    });
  });

  // =========================
  // START
  // =========================

  loadProjects();
});
