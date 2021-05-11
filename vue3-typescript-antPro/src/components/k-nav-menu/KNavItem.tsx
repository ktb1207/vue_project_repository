import { defineComponent, toRef, PropType } from 'vue';

import { NavMenuType } from './type';

import { ElSubmenu, ElMenuItemGroup, ElMenuItem } from 'element-plus';

interface Props {
  navItem: NavMenuType;
}

const KNavItem = defineComponent({
  name: 'KNavItem',
  props: {
    navItem: {
      type: Object as PropType<NavMenuType>,
      required: true
    }
  },
  components: {
    ElSubmenu,
    ElMenuItemGroup,
    ElMenuItem
  },
  setup(props: Props) {
    const menuItem = toRef(props, 'navItem');

    return {
      menuItem
    };
  },
  render() {
    if (this.menuItem.children) {
      const fontStr = `subicon iconfont ${this.menuItem.iconName}`;
      const slotContent = {
        title: () => (
          <>
            <i class={fontStr}></i>
            <span class="subtext">{this.menuItem.navLable}</span>
          </>
        )
      };
      return (
        <el-submenu index={this.menuItem.index} v-slots={slotContent}>
          {this.menuItem.children.map((item) => {
            if (item.children) {
              const innerContent = {
                title: () => <span>{item.navLable}</span>
              };
              return (
                <el-submenu index={item.index} v-slots={innerContent}>
                  {item.children.map((childrenItem) => {
                    return <KNavItem navItem={childrenItem}></KNavItem>;
                  })}
                </el-submenu>
              );
            }
            return <el-menu-item index={item.routeName}>{item.navLable}</el-menu-item>;
          })}
        </el-submenu>
      );
    } else {
      return <el-menu-item index={this.menuItem.routeName}>{this.menuItem.navLable}</el-menu-item>;
    }
  }
});

export default KNavItem;
