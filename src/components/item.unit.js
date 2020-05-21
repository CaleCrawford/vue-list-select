import { shallowMount } from '@vue/test-utils'
import { axe, toHaveNoViolations } from 'jest-axe'

import Item from '@/item.vue'

expect.extend(toHaveNoViolations)

describe('Item.vue', () => {
  let wrapper
  const item = 'new message'
  beforeAll(() => {
    wrapper = shallowMount(Item, {
      propsData: { item },
    })
  })
  it('renders props.item when passed', () => {
    expect(wrapper.text()).toMatch(item)
  })

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should not have any aXe violations', async () => {
    const html = wrapper.html()
    expect(
      await axe(html, {
        rules: {
          // for demonstration only, don't disable rules that need fixing.
          region: { enabled: false },
        },
      }),
    ).toHaveNoViolations()
  })

  describe('Validation', () => {
    it('Props.item is required', () => {
      expect(wrapper.vm.$options.props.item.required).toBeTruthy()
    })

    it('Props.item is of type string', () => {
      expect(wrapper.vm.$options.props.item.type).toBe(String)
    })
  })
})
