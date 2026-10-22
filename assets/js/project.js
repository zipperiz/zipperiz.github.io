document.addEventListener("DOMContentLoaded", function () {

  const projectContainer = document.getElementById("project-container");

  // Ambil ID project dari URL
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get("id");

  // Daftar kategori JSON
  const categories = [
    "website",
    "video",
    "photography",
    "branding",
    "graphic",
    "3d"
  ];

  let allProjects = [];


  // =========================
  // LOAD PROJECT DATA
  // =========================

  async function loadProjects() {

    try {

      const requests = categories.map(category =>
        fetch(`data/${category}.json`)
          .then(response => {

            if (!response.ok) {
              throw new Error(`Failed to load ${category}.json`);
            }

            return response.json();

          })
          .then(projects => {

            return projects.map(project => ({
              ...project,
              category: category
            }));

          })
      );


      const results = await Promise.all(requests);

      allProjects = results.flat();


      // Cari project berdasarkan ID
      const project = allProjects.find(
        item => item.id === projectId
      );


      if (!project) {

        projectContainer.innerHTML = `
          <div class="col-12">
            <h2>Project Not Found</h2>
            <p>The project you're looking for doesn't exist.</p>
            <a href="portfolio.html">
              ← Back to Projects
            </a>
          </div>
        `;

        return;

      }


      displayProject(project);


    } catch (error) {

      console.error("Project Error:", error);

      projectContainer.innerHTML = `
        <div class="col-12">
          <h2>Unable to Load Project</h2>
          <p>Please try again later.</p>
        </div>
      `;

    }

  }


  // =========================
  // DISPLAY PROJECT
  // =========================

  function displayProject(project) {

    document.title = `${project.title} | ZIPPERIZ`;


    const images = project.images || [];


    let imagesHTML = "";


    images.forEach(image => {

      imagesHTML += `
        <div class="project-image">
          <img
            src="${image}"
            alt="${project.title}"
          >
        </div>
      `;

    });


    projectContainer.innerHTML = `

      <div class="project-detail">

        <!-- Project Header -->
        <div class="project-header">

          <span class="project-category">
            ${project.category}
          </span>

          <h1>
            ${project.title}
          </h1>

          <span class="project-year">
            ${project.year || ""}
          </span>

        </div>


        <!-- Main Image -->
        <div class="project-cover">

          <img
            src="${project.thumbnail}"
            alt="${project.title}"
          >

        </div>


        <!-- Description -->
        <div class="project-description">

          <h3>
            About The Project
          </h3>

          <p>
            ${project.description || ""}
          </p>

        </div>


        <!-- Project Images -->
        <div class="project-gallery">

          ${imagesHTML}

        </div>


        <!-- Back -->
        <div class="project-navigation">

          <a href="portfolio.html">
            ← Back to Projects
          </a>

        </div>

      </div>

    `;

  }


  // =========================
  // START
  // =========================

  if (!projectId) {

    projectContainer.innerHTML = `
      <div class="col-12">
        <h2>Project Not Found</h2>
        <p>No project ID was provided.</p>
        <a href="portfolio.html">
          ← Back to Projects
        </a>
      </div>
    `;

    return;

  }


  loadProjects();

});