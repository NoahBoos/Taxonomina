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
    input {
        --toggle-size: 10px;

        appearance: none;
        width: 4.8em;
        height: 2.7em;
        font-size: var(--toggle-size);

        background: linear-gradient(
                to right,
                var(--color-base-10) 50%,
                var(--color-primary-400) 50%
        ) no-repeat;
        background-size: 205%;
        background-position: 0;

        transition: 0.4s;
        border-radius: 99em;
        position: relative;
        cursor: pointer;
    }

    input::before {
        content: "";
        width: 1.8em;
        height: 1.8em;

        position: absolute;
        top: 0.425em;
        left: 0.35em;

        background: linear-gradient(
                to right,
                var(--color-base-10) 50%,
                var(--color-primary-400) 50%
        ) no-repeat;
        background-size: 205%;
        background-position: 100%;

        border-radius: 50%;
        transition: 0.4s;
    }

    input:checked {
        background-position: 100%;
    }

    input:checked::before {
        left: calc(100% - 1.8em - 0.35em);
        background-position: 0;
    }
</style>

<div class="form-field-container flex flex-row items-center gap-2">
    <input type="checkbox" { id } { name } bind:checked={ checked } onchange={ onChange } />
    <label for={ id }>{ label }</label>
</div>