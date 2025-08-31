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

### Manual Tagging Videos:

![Click Upload](https://res.cloudinary.com/dittybzbt/image/upload/v1756649296/clickUpload_tgca8w.png)

* Click on upload video and select video

![Success Upload](https://res.cloudinary.com/dittybzbt/image/upload/v1756649946/successUpload_uttrqv.png)
![Tag Display](https://res.cloudinary.com/dittybzbt/image/upload/v1756649955/tagDisplay_lsjwrd.png)

* The video player should load the video and allow manual tagging.
  * In the tagging panel, the user can select the player, event type, and outcome, then add the tag to save. Tags are displayed in the timeline area, where unnecessary tags can be removed.
  * The user can easily start and stop video playback with the **spacebar**. The **left arrow key** rewinds 2 seconds, and the **right arrow key** fast-forwards 2 seconds.
* Once tagging is finished, the user can export the results as either a JSON or CSV file.
* Initially, JSON was supported and planned to be used for training the ML model, but the project eventually switched to using Excel instead.

### Training the ML Model:
* The first step is to ensure that the video used for tagging is moved to the `backend/data/videos` folder and that the CSV file is the `backend/data/raw` folder.
  
#### Transforming CSV -> CLean ML Ready Format:
* To make the data more friendly for the model, we run the `transform_csv` script in the `backend/scripts` folder.

``` sh
python .\scripts\transform_csv.py --in .\data\raw\analysis-2025-07-25.csv --out .\data\processed\manifest1.csv
```
* The `--in` argument specifies the location of the tagged CSV file.  
* The `--out` argument defines the output path and filename (e.g., `manifest1.csv`) for the ML-ready CSV file.  

* A successful run will display an output similar to the example below in the terminal:
```sh
Read 160 rows → wrote 160, skipped 0
Action counts: {'serve': 33, 'block': 31, 'pass': 48, 'spike': 23, 'set': 25}
```


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3
    - [ ] Nested Feature

See the [open issues](https://github.com/github_username/repo_name/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>


