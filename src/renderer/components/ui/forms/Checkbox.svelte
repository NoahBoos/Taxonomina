<script lang="ts">
    import { ErrorDomain, TaxonominaError } from "@/shared/errors/types";

    interface Props {
        name: string;
        label: string;
        checked?: boolean;
        onChange?: (...args: any[]) => void;
        variant?: 'default' | 'minimal';
        errors?: TaxonominaError<ErrorDomain>[];
    }

    let { name, label, checked = $bindable(false), onChange, variant = 'default', errors = [] }: Props = $props();
    let id = crypto.randomUUID();
</script>

<style lang="postcss">
    @reference '../../../styles/styles.css';

    input {
        @apply m-0 border-2 bg-base-10 transform scale-100;
    }

    input:hover {
        @apply border-accent-500 bg-base-20;
    }
</style>

<div class="{ variant === 'default' ? 'form-field-container' : '' } flex flex-row gap-2 { variant === 'default' && errors.length > 0 ? 'form-field-container--errors' : '' }">
    <input type="checkbox" { id } { name } bind:checked={ checked } onchange={ onChange } />
    <label for={ id }>{ label }</label>
</div>