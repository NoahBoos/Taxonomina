<script lang="ts">
    interface Props {
        name: string;
        label: string;
        checked?: boolean;
        onChange?: (...args: any[]) => void;
    }

    let { name, label, checked = $bindable(false), onChange }: Props = $props();
    let id = crypto.randomUUID();
</script>

<style>

</style>

<div>
    <label for={ id }>{ label }</label>
    <input type="checkbox" { id } { name } bind:checked={ checked } onchange={ onChange } />
</div>