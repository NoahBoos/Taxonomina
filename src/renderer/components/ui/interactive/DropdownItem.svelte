<script lang="ts">
    interface Props {
        label: string;
        onClick: (...args: any[]) => void;
    }

    let { label, onClick }: Props = $props();
</script>

<style>

</style>

<li>
    <button type="button" onclick={ onClick }>
        { label }
    </button>
</li>
