/* =====================================
   ZIPPERIZ — PROJECT NAVIGATION
===================================== */

const projectGroups = {
  branding: [
    {
      title: "ZIPPERIZ",
      url: "/page/branding/zipperiz.html"
    },    
    {
      title: "Koperasi Sari Apuan",
      url: "/page/branding/koperasi-sari-apuan.html"
    },
    {
      title: "Kubu Mesari Bonsai",
      url: "/page/branding/kubu-mesari-bonsai.html"
    }
  ],

  video: [
    {
      title: "Stamperly",
      url: "/page/video/stamperly.html"
    },
    {
      title: "Wedding Days A&E",
      url: "/page/video/wedding-days-A&E.html"
    }
  ],

  "3d": [
    {
      title: "Steel League",
      url: "/page/3d/steel-league.html"
    }
  ],

  graphic: []
};


/* =====================================
   AUTO PREVIOUS / NEXT NAVIGATION
===================================== */

document.addEventListener("DOMContentLoaded", function () {

  // Ambil URL halaman yang sedang dibuka
  const currentPath = decodeURIComponent(
    window.location.pathname
  ).toLowerCase();

  let currentGroup = null;
  let currentIndex = -1;

  // Cari project yang sedang dibuka
  for (const [groupName, projects] of Object.entries(projectGroups)) {

    const index = projects.findIndex(function (project) {
      return decodeURIComponent(project.url).toLowerCase() === currentPath;
    });

    if (index !== -1) {
      currentGroup = groupName;
      currentIndex = index;
      break;
    }
  }

  // Kalau project tidak ditemukan, hentikan
  if (currentGroup === null || currentIndex === -1) {
    console.warn("Project tidak ditemukan:", currentPath);
    return;
  }

  const projects = projectGroups[currentGroup];

  const previousProject =
    currentIndex > 0
      ? projects[currentIndex - 1]
      : null;

  const nextProject =
    currentIndex < projects.length - 1
      ? projects[currentIndex + 1]
      : null;

  // Ambil elemen navigasi HTML
  const navigation = document.querySelector(".project-navigation");

  if (!navigation) {
    console.warn("Elemen .project-navigation tidak ditemukan");
    return;
  }

  const previousLink = navigation.querySelector(
    ".project-nav-link:not(.project-nav-next)"
  );

  const nextLink = navigation.querySelector(
    ".project-nav-next"
  );

  // Atur Previous Project
  if (previousLink) {
    if (previousProject) {
      previousLink.href = previousProject.url;

      const title = previousLink.querySelector("strong");

      if (title) {
        title.textContent = "← " + previousProject.title;
      }
    } else {
      previousLink.style.visibility = "hidden";
    }
  }

  // Atur Next Project
  if (nextLink) {
    if (nextProject) {
      nextLink.href = nextProject.url;

      const title = nextLink.querySelector("strong");

      if (title) {
        title.textContent = nextProject.title + " →";
      }
    } else {
      nextLink.style.visibility = "hidden";
    }
  }

});