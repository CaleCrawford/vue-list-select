import { shallowMount } from '@vue/test-utils'
import { axe, toHaveNoViolations } from 'jest-axe'

import VueListSelect from '@/vue-list-select.vue'

expect.extend(toHaveNoViolations)

describe('Item.vue', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(VueListSelect, {
      propsData: {
        list: ['One', 'Two', 'Three'],
        value: [],
      },
    })
  })
  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should not have any aXe violations', async () => {
    const html = wrapper.html()
    expect(await axe(html)).toHaveNoViolations()
  })

  it('calls selectItem when item is clicked on', () => {
    const stub = jest.fn()
    wrapper.setMethods({ selectItem: stub })

    wrapper.find({ ref: 'item' }).trigger('click')
    expect(stub).toBeCalled()
  })

  it('triggers a message-clicked event when a handleClick method is called', async () => {
    const stub = jest.fn()
    wrapper.vm.$on('input', stub)
    wrapper.vm.selectItem(wrapper.vm.list[0])

    expect(stub).toBeCalledWith(['One'])
  })
})
