<a id="readme-top"></a>


<!-- PROJECT LOGO -->
<br />
<div align="center">
<!--   <a href="https://github.com/jtran217/astro-vision">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a> -->

<h3 align="center">Astro Vision</h3>

  <p align="center">
    Astro Vision is a web-based application that allows casual volleyball players and teams to upload their match footage, manually tag in-game events, and track performance statistics. Players can log key actions such as spikes, serves, receives, and rallies, with each tagged event contributing to detailed performance insights.

The initial version of Astro Vision focuses on manual tagging, enabling users to categorize plays as successful or unsuccessful and view aggregated stats over time. This provides teams with a structured way to evaluate their strengths and areas for improvement, even without professional tools.

Looking ahead, the project aims to integrate machine learning models to automatically detect and classify volleyball events from uploaded footage. By leveraging computer vision and activity recognition techniques, Astro Vision will reduce the need for manual input and provide real-time analytics.

This project serves as a foundation for blending sports, technology, and AI, with the long-term vision of making advanced performance analysis tools accessible to recreational athletes and community teams.
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project
<img src="https://res.cloudinary.com/dittybzbt/image/upload/v1756346677/astro_vision_front_end_gmesps.png"/>
This project was inspired by the lack of affordable and user-friendly tools for volleyball players who want to review their gameplay outside of professional or elite-level software. The platform is being developed with a Next.js frontend and will eventually integrate a FastAPI backend for managing video uploads, tagging data, and model predictions.

At the current stage, the tagging feature is limited to a closed group of six team members for testing, and there is no editing functionality yet once a tag has been created. The primary technical challenge underway is training a machine learning model that can accurately classify and predict the outcomes of in-game actions from video clips. This will allow AstroVision to move beyond manual tagging and into automated, AI-assisted video analysis.

In the near term, AstroVision aims to expand tagging capabilities beyond the initial team and introduce editing features for greater flexibility. Longer-term goals include integrating the trained ML model, building out player statistics dashboards, and optimizing the site for scalable use.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* Next.js
* Python
* PyTorch
* OpenCV

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Frontend

#### Prerequisites

* Before running the frontend locally, make sure you have:
  * [Node.js](https://nodejs.org/) version 18.x or higher
  *  npm (comes with Node.js)
  *  [Git](https://git-scm.com/) for cloning the repository 

#### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/jtran217/astro-vision.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Running the repo `config.js`
   ```sh
   npm run dev
   ```
<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Backend

#### Prerequisites
* Before running the backend locally make sure you have:
*  * Python 3.10+
   * ffmpeg on PATH (used by the clip extractor)
   *  * macOS(Homebrew): `brew install ffmpeg`
      * Windows(Chocolatey): `choco install ffmpeg`
      * Verify: `ffmpeg -version`

#### Installation 
```sh
pip install -r backend/requirements.txt
```

<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3
    - [ ] Nested Feature

See the [open issues](https://github.com/github_username/repo_name/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
