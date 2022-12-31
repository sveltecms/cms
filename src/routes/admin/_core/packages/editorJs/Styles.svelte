<svelte:head>
    <style>
        .ce-popover--opened {
            color: #484848;
        }
        .ce-block a{
            color:var(--linkColor);
        }
        .ce-code__textarea {
            min-height: fit-content !important;
        }
        .cdx-block{
            background-color: var(--bg);
            color: var(--color);
        }
        .ce-toolbar__settings-btn{
            color: var(--color);
            margin-left: 10px;
            background-color: rgba(0,0,0,.1);
        }
        .ce-toolbar__settings-btn:hover{
            background-color: rgba(0,0,0,.1);
        }
        .ce-toolbar__plus,.ce-toolbar__plus:hover{
            background-color: rgba(0,0,0,.1);
            color: var(--buttonColor);
        }
        .ce-toolbar__plus:hover{
            opacity: 80%;
        }
        .ce-header{
            color: var(--color);
            font-weight: 600;
            font-size: 25px;
        }
        .ce-toolbar__actions--opened{
            background-color: var(--buttonBg);
            box-shadow: 1px 2px 4px #00000094;
            padding: 10px 20px;
            border-radius: 50px;
            margin-right: 0px;
            right: 50%;
            transform: translateX(50%);
            top: -40px;
        }
        .ce-block__content{
            max-width: 100%;
            color: var(--color);
        }
        .cdx-marker{
            background: #c3cb6236;
            color: var(--color);
            padding: 2px 4px;
            border-radius: 5px;
        }
    </style>
</svelte:head>