import WidgetForm from '@/components/dashboard/WidgetForm'

export default function NewWidgetPage() {
  return (
    <>
      <div className="topbar">
        <span className="topbar-title">Create Widget</span>
      </div>
      <div className="page-content">
        <WidgetForm mode="create" />
      </div>
    </>
  )
}
