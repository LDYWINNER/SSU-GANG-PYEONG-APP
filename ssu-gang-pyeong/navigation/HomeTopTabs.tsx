import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { CourseDetail } from "../screens";

const semesters = ["2023-fall", "2023-spring", "2022-fall"];

const Tab = createMaterialTopTabNavigator();

function HomeTopTabs() {
  return (
    <Tab.Navigator>
      {semesters.map((semester) => (
        <Tab.Screen key={semester} name={semester} component={CourseDetail} />
      ))}
    </Tab.Navigator>
  );
}

export default HomeTopTabs;
