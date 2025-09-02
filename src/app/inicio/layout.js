import Sidebar from "@/component/nabvar/sidebar";
import { getPages } from "@/libs/controllers/pages/getPAges";

export default async function Layout({ children }) {
  const { groupedApps, pages, email } = await getPages();
  return (
    <section className="">
      <div className="grid grid-cols-1  ">
   
        <div className="">
          <Sidebar
            children={children}
            apps={groupedApps}
            pages={pages}
            email={email}
          />
        </div>
      </div>
    </section>
  );
}
