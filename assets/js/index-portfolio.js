document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("home-portfolio-container");

  if (!container) {
    return;
  }

  // ==============================
  // JSON FILES
  // ==============================

  const jsonFiles = [
    "data/website.json",
    "data/video.json",
    "data/photography.json",
    "data/branding.json",
    "data/graphic.json",
    "data/3d.json"
  ];

  // ==============================
  // DATE HELPER
  // ==============================

  function getProjectDate(project) {
    // Preferred: exact project date, e.g. "2026-10-02"
    if (project.date) {
      const time = new Date(project.date).getTime();

      if (!Number.isNaN(time)) {
        return time;
      }
    }

    // Fallback: project year
    if (project.year) {
      const year = Number.parseInt(project.year, 10);

      if (!Number.isNaN(year)) {
        return new Date(year, 11, 31).getTime();
      }
    }

    // No usable date
    return 0;
  }

  // ==============================
  // LOAD JSON
  // ==============================

  Promise.all(
    jsonFiles.map(function (file) {
      return fetch(file)
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Failed to load " + file);
          }

          return response.json();
        })
        .catch(function (error) {
          console.warn(error);
          return [];
        });
    })
  )

  // ==============================
  // PROCESS PROJECTS
  // ==============================

    .then(function (results) {
      let projects = [];

      // Gabungkan semua JSON
      results.forEach(function (categoryProjects) {
        if (Array.isArray(categoryProjects)) {
          projects = projects.concat(categoryProjects);
        }
      });

      // Hide draft/template items marked hidden:true in category JSON.
      projects = projects.filter(function (project) {
        return project.hidden !== true;
      });

      // Sort project terbaru → terlama.
      // "date" diprioritaskan, lalu fallback ke "year".
      projects.sort(function (a, b) {
        return getProjectDate(b) - getProjectDate(a);
      });

      // Ambil maksimal 6 project terbaru
      const selectedProjects = projects.slice(0, 6);

      // Jika tidak ada project
      if (selectedProjects.length === 0) {
        container.innerHTML = `
          <div class="col-lg-12 text-center">
            <p>No projects found.</p>
          </div>
        `;

        return;
      }

      // ==============================
      // RENDER PROJECTS
      // ==============================

      selectedProjects.forEach(function (project) {
        const col = document.createElement("div");
        col.className = "col-lg-4 col-md-6";

        col.innerHTML = `
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
                  <h5>${project.title}</h5>
                  <p>${project.category} / ${project.year || ""}</p>
                </div>
              </a>
            </div>
          </div>
        `;

        container.appendChild(col);
      });
    })

    // ==============================
    // ERROR HANDLING
    // ==============================

    .catch(function (error) {
      console.error("Portfolio loading error:", error);

      container.innerHTML = `
        <div class="col-lg-12 text-center">
          <p>Unable to load projects.</p>
        </div>
      `;
    });
});
