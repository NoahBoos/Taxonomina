<script lang="ts">
    interface Props {
        name: string;
        label: string;
        checked?: boolean;
        onChange?: (...args: any[]) => void;
        variant?: 'default' | 'minimal';
    }

    let { name, label, checked = $bindable(false), onChange, variant = 'default' }: Props = $props();
    let id = crypto.randomUUID();
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    input {
        @apply m-0 border-2 bg-base-10 transform scale-100;
    }

    input:hover {
        @apply border-primary-300 bg-base-20;
    }
</style>

<div class="{ variant === 'default' ? 'form-field-container' : '' } flex flex-row gap-2">
    <input type="checkbox" { id } { name } bind:checked={ checked } onchange={ onChange } class="input-checkbox" />
    <label for={ id }>{ label }</label>
</div>