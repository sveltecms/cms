## SVELTECMS
### All In One Svelte Kit Content Management System
Add A Cms To Your Svelte Projects Without Having To Leave Your Work Folder.
### WARNING
<div class="warning">
    <p>Make sure <a href="http://mongodb.org" target="_blank" rel="noopener noreferrer">MongoDB</a> is installed</p>
    <p>Make sure your <a href="http://mongodb.org" target="_blank" rel="noopener noreferrer">SvelteKit</a> Project is a <a href="http://mongodb.org" target="_blank" rel="noopener noreferrer">TypesScript</a> Project</p>
</div>
<style>
    .warning{
        font-weight: 300;
        background-color: #eb5757;
        color: white;
        padding: 10px;
        border-radius: 5px;
        display: flex;
        flex-direction:column;
        justify-content: center;
    }
    .warning a{
        text-decoration: none;
        font-weight: 800;
    }
</style>

#### Step 1: create a svelteKit project
``` bash
npm create svelte@latest appName
cd appName
```
![create svelte kit](https://raw.githubusercontent.com/sveltecms/svelteCMS/main/images/step-1.png)
### Make sure you select TypeScript
Since svelteCMS uses TypeScript to auto generate routes and routes objects types
![create svelte kit](https://raw.githubusercontent.com/sveltecms/svelteCMS/main/images/step-2.png)
### Add svelteCMS to an existing using npx
``` bash
npx sveltejscms@latest
# Optional: MongoDB database url
npx sveltejscms@latest --dbUrl=mongodb://localhost:27017
# Optional: App name( project name )
npx sveltejscms@latest --appName=yourAppName
```