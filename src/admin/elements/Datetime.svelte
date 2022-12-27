<script lang="ts">
    /** Datetime numeric, bind:value to variable number */
    export let value:number
    const date = new Date(value)
    const defaultValue = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}`
    /** Update date and time when datetime input changes */
    function updateDate(e:any){
        value = e.target.valueAsNumber
    }
</script>

<input type="datetime-local" value={defaultValue} on:change={updateDate}>

<style lang="scss">
    input{
        border: none;
        padding: 10px;
        border-radius: 5px;
        background-color: var(--antiBodyBg);
        color: white;
        margin-bottom: 15px;
        font-size: 15px;
        &:focus{ outline: none; }
        &::-webkit-calendar-picker-indicator{
            cursor: pointer;
            border-radius: 50%;
            padding: 5px;
            background-color: rgb(242, 242, 242);
        }
    }
</style>