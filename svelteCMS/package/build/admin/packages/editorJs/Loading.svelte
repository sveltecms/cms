<div class="wrapper">
    <div class="spinner"></div>
</div>

<style>
    .wrapper{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 4.5px;
        background-color: var(--bg);
        border-radius: 5px;
    }
    .spinner{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: transparent;
        border: #edededc8 5px solid;
        border-top: var(--loaderColor) 5px solid;
        animation: spin 1s ease-in-out infinite;
    }
    @keyframes spin {
        from{ transform: rotate(0deg);}
        to{ transform: rotate(360deg);}  
    }
</style>