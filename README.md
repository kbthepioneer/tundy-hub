# Web Development Final Project - Tundy Hub

Submitted by: **Kevin Bayona**

This web app: **Tundy Hub is a community forum dedicated to Toyota Tundra truck enthusiasts, allowing users to share build posts, discuss challenges, upvote favorite rigs, and leave comments.**

Time spent: **10** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] **Web app includes a create form that allows the user to create posts**
  - Form requires users to add a post title
  - Forms should have the *option* for users to add: 
    - additional textual content
    - an image added as an external image URL
- [x] **Web app includes a home feed displaying previously created posts**
  - Web app must include home feed displaying previously created posts
  - By default, each post on the posts feed should show only the post's:
    - creation time
    - title 
    - upvotes count
  - Clicking on a post should direct the user to a new page for the selected post
- [x] **Users can view posts in different ways**
  - Users can sort posts by either:
    - creation time
    - upvotes count
  - Users can search for posts by title
- [x] **Users can interact with each post in different ways**
  - The app includes a separate post page for each created post when clicked, where any additional information is shown, including:
    - content
    - image
    - comments
  - Users can leave comments underneath a post on the post page
  - Each post includes an upvote button on the post page. 
    - Each click increases the post's upvotes count by one
    - Users can upvote any post any number of times
- [x] **A post that a user previously created can be edited or deleted from its post pages**
  - After a user creates a new post, they can go back and edit the post
  - A previously created post can be deleted from its post page

The following **optional** features are implemented:

- [x] Web app displays a loading animation whenever data is being fetched

The following **additional** features are implemented:

* [x] Custom dark-theme responsive UI with modern CSS design tokens

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='YOUR_GIF_URL_HERE' title='Video Walkthrough' width='' alt='Video Walkthrough' />

GIF created with **ScreenToGif** (Windows) / **Kap** (macOS).

## Notes

Configuring state syncing between local React component state and Supabase arrays for real-time comment rendering.

## License

    Copyright 2026 Kevin Bayona

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.